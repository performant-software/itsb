import createGraph from 'ngraph.graph';

// Just makes sure there's an 'id' prop, and normalize 'type'
const normalizeNode = n => {
  if (n.id) 
    return n;

  n.id = n['@id'];
  delete n['@id'];

  if (!n.id)
    throw { message: 'Missing node ID', node: n };

  if (n['@type']) {
    n.type = n['@type'];
    delete n['@type'];
  }

  return n;
}

// Itinerary to waypoints
const splitItinerary = it => {
  const itineraryId = it.id;
  const authorId = it.target.id;
  const waypointList = it.body.value;

  // Work around a conceptual difference between LP and our
  // graph model: 'id' in LP refers to the place; but it 
  // identifies the waypoint node itself in our graph!
  return waypointList.map((value, idx) => ({
    ...value,
    place: value.id,
    id: `${itineraryId}/wp/${idx}`
  }));
}

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

    console.log(waypointNodes);

    waypointNodes.forEach(n => this.graph.addNode(n.id, n));
  }

  listNodesWithType = type => {
    const nodes = [];

    this.graph.forEachNode(({ data }) => {
      if (data.type === type)
        nodes.push(data);
    });

    return nodes;
  }

  listAuthors = () =>
    this.listNodesWithType('Person');

  listPlaces = () =>
    this.listNodesWithType('Feature');

  listItineraries = () => {

  }

  listWaypoints = () => {

  }

  /**
   * Queries - trying to keep as generic and close
   * to current Peripleo store as possible!
   */
  getNode = id => {
    // TODO returns Node or undefined;
  }

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