import { ArcLayer } from '@peripleo/peripleo/deck.gl/layers';

/**
 * The task of the ItineraryLayer is to take a search result,
 * and turn the itinerary trajectories into DeckGL layers.
 */
export const ItinerariesLayer = (resultItems, graph) => {

  return resultItems.map(({ author, trajectory}) => {
    const { color } = graph.getNode(author);

    return new ArcLayer({
      id: `${author}/trajectory`, 
      data: trajectory,
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