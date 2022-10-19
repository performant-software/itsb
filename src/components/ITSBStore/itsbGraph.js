import createGraph from 'ngraph.graph';
import { 
  normalizeNode,  
  filterByTime,
  groupBy, 
  sortWaypoints,
  splitItinerary
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

  constructor() {
    this.graph = createGraph();
  }

  init = (authors, places, itineraries) => {
    this.graph.clear();

    this.graph.beginUpdate();

    // Authors and places can be treated the same way
    const authorNodes = authors.map(normalizeNode);
    const placeNodes = places.map(normalizeNode);

    [...authorNodes, ...placeNodes ].forEach(n => 
      this.graph.addNode(n.id, n));

    // Itineraries are split to waypoint nodes
    const waypointNodes = itineraries.reduce((waypoints, it) => {
      return [...waypoints, ...splitItinerary(it)]
    }, []).filter(wp => { 
      const isValid = this.exists(wp.author, wp.place);

      if (!isValid)
        console.warn('Skipping unconnected node', wp);

      return isValid;
    });

    waypointNodes.forEach(wp => this.graph.addNode(wp.id, wp));

    // Link waypoints to authors
    waypointNodes.forEach(wp => {
      const sourceId = wp.id;
      const targetId = wp.author;
      this.graph.addLink(sourceId, targetId, { relation: 'visitedBy' });
    });

    // Link waypoints to places
    waypointNodes.forEach(wp => {
      const sourceId = wp.id;
      const targetId = wp.place;
      this.graph.addLink(sourceId, targetId, { relation: 'locatedAt' });
    });

    // Link waypoints in sequence
    waypointNodes.reduce((previous, wp) => {
      if (previous && previous.author === wp.author) {
        const sourceId = wp.id;
        const targetId = previous.id;
        this.graph.addLink(sourceId, targetId, { relation: 'previous'});
      }

      return wp;
    }, null);

    this.graph.endUpdate();
  }

  getNode = id =>
    this.graph.getNode(id)?.data;

  listNodesWithProperty = (key, value) => {
    const nodes = [];

    this.graph.forEachNode(n => {
      if (n.data[key] === value)
        nodes.push(n.data);
    });

    return nodes;
  }

  getLinksOfType = (nodeId, relation) => {
    const links = [];

    this.graph.forEachLinkedNode(nodeId, (node, link) => {
      if (link.data.relation === relation)
        links.push(link);
    }, false);

    return links;
  }

  listAuthors = () =>
    this.listNodesWithProperty('@type', 'Person');

  listPlaces = () =>
    this.listNodesWithProperty('type', 'Feature');

  listItineraries = (dateRange) => {
    const allWaypoints = this.listNodesWithProperty('type', 'waypoint');

    const filtered = dateRange ? 
      filterByTime(allWaypoints, dateRange) : allWaypoints;

    const groupedByAuthor = groupBy(filtered, 'author');

    return Object.entries(groupedByAuthor).map(([author, waypoints]) =>
      ({ author, waypoints: sortWaypoints(waypoints, this.graph) }));
  }

  getNextWaypoint = waypoint => {
    const neighbours = this.getLinksOfType(waypoint.id, 'previous');

    // Get inbound previous link
    const inbound = neighbours.find(n => n.toId === waypoint.id);
    return inbound && this.getNode(inbound.fromId);
  }

  getPreviousWaypoint = waypoint => {
    console.log('PREV');
    const neighbours = this.getLinksOfType(waypoint.id, 'previous');
    console.log(neighbours);

    // Get output previous link
    const outbound = neighbours.find(n => n.fromId === waypoint.id);
    return outbound && this.getNode(outbound.toId);
  }

  exists() {
    if (arguments.length > 0) {
      return [...arguments].every(id => this.getNode(id));
    }
  }

}