import { ArcLayer } from '@peripleo/peripleo/deck.gl';

const toArc = (waypoints, graph) => {
  const trajectory = [];

  for (let i=1; i<waypoints.length; i++) {
    trajectory.push({
      from: graph.getNode(waypoints[i-1].place).geometry,
      to: graph.getNode(waypoints[i].place).geometry
    });
  }

  return trajectory;
}

/**
 * The task of the ItineraryLayer is to take a search result,
 * and turn the itinerary trajectories into DeckGL layers.
 */
export const ItinerariesLayer = (resultItems, graph) => {

  return resultItems.map(({ author, waypoints }) => {
    const arc = toArc(waypoints, graph);

    const { color } = graph.getNode(author);

    return new ArcLayer({
      id: `${author}/trajectory`, 
      data: arc,
      pickable: false,
      getWidth: 1.5,
      widthMinPixels: 1,
      getHeight: 1,
      getTilt: 10,
      greatCircle: false,
      getSourcePosition: d => d.from.coordinates,
      getTargetPosition: d => d.to.coordinates,
      getSourceColor: color,
      getTargetColor: color
    })
  });

}