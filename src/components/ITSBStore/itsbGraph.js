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

    // Authors and places can be treated the same way
    const authorNodes = authors.map(normalizeNode);
    const placeNodes = places.map(normalizeNode);

    [...authorNodes, ...placeNodes ].forEach(n => 
      this.graph.addNode(n.id, n));

    // Itineraries are split to waypoint nodes
    const waypointNodes = itineraries.reduce((waypoints, it) => {
      return [...waypoints, ...splitItinerary(it)]
    }, []);

    waypointNodes.forEach(n => this.graph.addNode(n.id, n));
  }

  listNodesWithProperty = (key, value) => {
    const nodes = [];

    this.graph.forEachNode(({ data }) => {
      if (data[key] === value)
        nodes.push(data);
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

    return Object.entries(groupedByAuthor).map(([author, waypoints]) => {
      // TODO sort waypoints by 'when'
      return { author, waypoints };
    });
  }

  listWaypoints = () => {

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