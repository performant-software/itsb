import createGraph from 'ngraph.graph';
import Fuse from 'fuse.js';
import diacritics from 'diacritics';
import {
  filterWaypointsByTime,
  groupBy,
  normalizeNode,
  sortWaypointsBySequence,
  splitItinerary,
} from './utils';

/**
 * A domain graph model for ITSB with the following
 * types of nodes:
 *
 * - author (id, name)
 * - place (GeoJSON/LP feature)
 * - waypoint (one stop on the itinerary, linked to
 *   author, place, citations, and scoped by time
 *
 * Edges:
 * - waypoints are linked to author
 * - waypoints are linked to places
 * - waypoints are (directionally!) linked to waypoints
 */
export class ITSBGraph {
  // eslint-disable-next-line jsdoc/require-jsdoc
  constructor() {
    this.graph = createGraph();

    this.fulltextIndex = new Fuse([], {
      ignoreLocation: true,
      threshold: 0.25,
      keys: [
        'name', // author name
        'properties.title', // place title
        'citations.label', // waypoint citations
        'relation.label', // waypoint notes
      ],

      /**
       * Remove diacritics for search
       *
       * @param {object} obj Search object
       * @param {string | Array<string>} path Search path
       * @returns {string | Array<string> | void} Query without diacritics
       */
      getFn: (obj, path) => {
        const value = Fuse.config.getFn(obj, path);

        if (Array.isArray(value)) {
          return value.map(diacritics.remove);
        } else if (value) {
          return diacritics.remove(value);
        }
      },
    });
  }

  /**
   * This method initialises the graph from the JSON data.
   *
   * Authors and Places are stored as nodes in the graph directly.
   *
   * Itineraries are pre-preprocessed: each itinerary is split into
   * waypoints; and waypoints are sorted by time. The sorted waypoints
   * are stored as nodes in the graph, and connected by edges in sequence.
   *
   * A verification step ensures that only connected waypoints are included
   * in the graph. If a waypoint is not connected to an Author AND a Place,
   * its import is skipped (and an error message is logged).
   *
   * All graph nodes (Authors, Places, Waypoints) are additionally stored
   * in the Fuse.js fulltext index.
   *
   * @param {List<object>} authors List of author objects
   * @param {List<object>} places List of place objects
   * @param {List<object>} itineraries List of itineraries (objects with
   * authors and lists of waypoints)
   * @returns {void}
   */
  init = (authors, places, itineraries) => {
    this.graph.clear();

    this.graph.beginUpdate();

    // Authors and places can be treated the same way
    const authorNodes = authors.map(normalizeNode);
    const placeNodes = places.map(normalizeNode);

    [...authorNodes, ...placeNodes].forEach((n) => {
      this.graph.addNode(n.id, n);
      this.fulltextIndex.add(n);
    });

    // Itineraries are split to waypoint nodes
    const waypointNodes = itineraries
      .reduce((allWaypoints, it) => {
        return [...allWaypoints, ...splitItinerary(it)];
      }, [])
      .filter((wp) => {
        const isValid = this.exists(wp.author, wp.place);

        if (!isValid) console.warn('Skipping unconnected node', wp);

        return isValid;
      });

    waypointNodes.forEach((wp) => {
      this.graph.addNode(wp.id, wp);
      this.fulltextIndex.add(wp);
    });

    // Link waypoints to authors
    waypointNodes.forEach((wp) => {
      const sourceId = wp.id;
      const targetId = wp.author;
      this.graph.addLink(sourceId, targetId, { relation: 'visitedBy' });
    });

    // Link waypoints to places
    waypointNodes.forEach((wp) => {
      const sourceId = wp.id;
      const targetId = wp.place;
      this.graph.addLink(sourceId, targetId, { relation: 'locatedAt' });
    });

    // Link waypoints in sequence
    waypointNodes.reduce((previous, wp) => {
      if (previous && previous.author === wp.author) {
        const sourceId = wp.id;
        const targetId = previous.id;
        this.graph.addLink(sourceId, targetId, { relation: 'previous' });
      }

      return wp;
    }, null);

    this.graph.endUpdate();
  };

  /**
   * Checks if one or more nodes with the given ID(s)
   * exist in the graph. The method accepts multiple arguments.
   * You can check for a single ID by calling `exists('id1')`,
   * or for multiple IDs by calling `exists('id1', 'id2', 'id3').
   * The return value will be `true` if ALL IDs exist in the graph.
   *
   * @param {...string} args one or multiple node ids
   * @returns {boolean | void} true if ALL of the given IDs exist
   */
  exists = (...args) => {
    if (args.length > 0) {
      return args.every((id) => this.getNode(id));
    }
  };

  /**
   * Helper method that lists nodes that include a certain
   * key-value pair (such as `type='Author'`).
   *
   * @param {string} key A key
   * @param {*} value A value for that key
   * @returns {Array<object>} the list of nodes that match the criterion
   */
  listNodesWithProperty = (key, value) => {
    const nodes = [];

    this.graph.forEachNode((n) => {
      if (n.data[key] === value) nodes.push(n.data);
    });

    return nodes;
  };

  /**
   * Helper method that returns the links from a specific node,
   * of a specific type (such as: all `visitedBy` links on Author X).
   *
   * @param {string} nodeId Node with links to other nodes
   * @param {object | string} relation Relation query
   * @returns {Array<object>} the list of links
   */
  getLinksOfType = (nodeId, relation) => {
    const links = [];

    this.graph.forEachLinkedNode(
      nodeId,
      (node, link) => {
        if (link.data.relation === relation) links.push(link);
      },
      false
    );

    return links;
  };

  /**
   * Retrieves a node from the graph by its ID.
   *
   * @param {string} id Node ID
   * @returns {object | undefined} the Author, Place or Waypoint node, or undefined
   */
  getNode = (id) => this.graph.getNode(id)?.data;

  /**
   * Returns all Authors (nodes of `@type` = 'Person').
   *
   * @returns {Array<object>} the list of authors
   */
  listAuthors = () => this.listNodesWithProperty('@type', 'Person');

  /**
   * Returns all Places (nodes of `type` = 'Feature').
   *
   * @returns {Array<object>} the list of Places
   */
  listPlaces = () => this.listNodesWithProperty('type', 'Feature');

  /**
   * Returns all itineraries, optionally filtered by a date range.
   * The date range format conforms to that used in the ITSBSearchHandler,
   * and is an array of two ISO-formatted strings (start and end of the
   * date range).
   *
   * The response format is an array of itinerary objects:
   *
   * {
   *   'author': 'author-id',
   *   'waypoints': [
   *     //...list of waypoint nodes, sorted by time
   *   ]
   * }
   *
   * @param {[string, string]} dateRange Two ISO-formatted date strings
   * @returns {Array<object>} the list of itineraries
   */
  listItineraries = (dateRange) => {
    const allWaypoints = this.listNodesWithProperty('type', 'waypoint');

    const filtered = dateRange ? filterWaypointsByTime(allWaypoints, dateRange) : allWaypoints;

    const groupedByAuthor = groupBy(filtered, 'author');

    return Object.entries(groupedByAuthor).map(([author, waypoints]) => ({
      author,
      waypoints: sortWaypointsBySequence(waypoints, this.graph),
    }));
  };

  /**
   * Returns the full itinerary for a given Author.
   *
   * @param {string} authorId the Author ID
   * @returns {Array<object>} the list of Waypoints
   */
  getItineraryForAuthor = (authorId) =>
    this.getLinksOfType(authorId, 'visitedBy').map((link) => this.getNode(link.fromId));

  /**
   * Returns the list of waypoints (from all authors!) located
   * at this place.
   *
   * @param {string} placeId the Place ID
   * @returns {Array<object>} the list of Waypoints at this place
   */
  getWaypointsAt = (placeId) =>
    this.getLinksOfType(placeId, 'locatedAt').map((link) => this.getNode(link.fromId));

  /**
   * Given a waypoint, this method returns the next waypoint on the
   * same itinerary. The method will return undefined, if the given waypoint
   * is the last on the itinerary.
   *
   * @param {object} waypoint a Waypoint
   * @returns {object} the next Waypoint on the itinerary (or undefined)
   */
  getNextWaypoint = (waypoint) => {
    const neighbours = this.getLinksOfType(waypoint.id, 'previous');

    // Get inbound previous link
    const inbound = neighbours.find((n) => n.toId === waypoint.id);
    return inbound && this.getNode(inbound.fromId);
  };

  /**
   * Given a waypoint, this method returns the previous waypoint on the
   * same itinerary. The method will return undefined, if the given waypoint
   * is the first on the itinerary.
   *
   * @param {object} waypoint A waypoint
   * @returns {object | undefined} the previous Waypoint on the itinerary (or undefined)
   */
  getPreviousWaypoint = (waypoint) => {
    const neighbours = this.getLinksOfType(waypoint.id, 'previous');

    // Get output previous link
    const outbound = neighbours.find((n) => n.fromId === waypoint.id);
    return outbound && this.getNode(outbound.toId);
  };

  /**
   * Queries the Fuse.js index with the given search query
   *
   * @param {string} query a search query
   * @returns {Array<object>} the list of nodes matching the query
   */
  search = (query) =>
    this.fulltextIndex.search(diacritics.remove(query)).map((result) => result.item);
}
