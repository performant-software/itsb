import createGraph from 'ngraph.graph';
import { normalizeNode, splitItinerary, groupBy } from './utils';

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

    waypointNodes.forEach(wp => this.graph.addNode(wp.id,wp));

    // Link waypoints to authors
    waypointNodes.forEach(wp => {
      const sourceId = wp.id;
      const targetId = wp.author;
      this.graph.addLink(sourceId, targetId);
    });

    // Link waypoints to places
    waypointNodes.forEach(wp => {
      const sourceId = wp.id;
      const targetId = wp.place;
      this.graph.addLink(sourceId, targetId);
    });

    // Link waypoints in sequence
    waypointNodes.reduce((previous, wp) => {
      if (previous) {
        const sourceId = previous.id;
        const targetId = wp.id;
        this.graph.addLink(sourceId, targetId);
      }

      return wp;
    }, null);

    this.graph.endUpdate();
  }

  listNodesWithProperty = (key, value) => {
    const nodes = [];

    this.graph.forEachNode(n => {
      // if (!n.data)
      //   console.log(n.id, n);
      if (n.data[key] === value)
        nodes.push(n.data);
    });

    return nodes;
  }

  listAuthors = () =>
    this.listNodesWithProperty('@type', 'Person');

  listPlaces = () =>
    this.listNodesWithProperty('type', 'Feature');

  listItineraries = () => {
    const allWaypoints = this.listNodesWithProperty('relation', 'waypoint');

    const groupedByAuthor = groupBy(allWaypoints, 'author');

    // TODO sort by sequence!
    const waypoints = Object.entries(groupedByAuthor).map(([author, waypoints]) => {
      return { author, waypoints };
    });

    return waypoints;
  }

  exists() {
    if (arguments.length > 0) {
      return [...arguments].every(id => this.getNode(id));
    }
  }

  getNode = id =>
    this.graph.getNode(id)?.data;

  getConnectedNodes = id => {
    // TODO returns a Promise<Node[]>
    /*
    const linkedNodes = [];

    this.graph.forEachLinkedNode(id, (node, link) => {
      if (node.data)
        linkedNodes.push({ node, link });
    });

    return linkedNodes.map(t => t.node.data);
    */
  }

}