import createGraph from 'ngraph.graph';

/** 
 * Experimenting with a custom store, while we're still 
 * figuring out a good way to model this in Peripleo.
 */
export class SameBoatsStore {

  constructor() {
    this.graph = createGraph();
  }

  init = (authors, places, itineraries) => {
    // TODO we'll build a graph model
    // with the following types of nodes:
    // - Author (id, name)
    // - Waypoint (one stop on the itinerary, 
    //   linked to the author, the place, citations, 'when')
    // - Place (GeoJSON/LP feature)

    // Edges:
    // - Authors linked to waypoints
    // - Waypoints linked to places
    // - Waypoints linked to waypoints (directional?)
  }

  /**
   * Queries - trying to keep as generic and close
   * to current Peripleo store as possible!
   */
  getNode = id =>
    this.graph.getNode(normalizeURI(id))?.data;

  getConnectedNodes = id => {
    const linkedNodes = [];

    this.graph.forEachLinkedNode(id, (node, link) => {
      if (node.data)
        linkedNodes.push({ node, link });
    });

    return linkedNodes.map(t => t.node.data);
  }

}