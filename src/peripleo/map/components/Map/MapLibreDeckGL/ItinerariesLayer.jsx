import { ArcLayer } from '@deck.gl/layers';

/**
 * The task of the ItineraryLayer is to take a search result,
 * and turn the itinerary trajectories into DeckGL layers.
 */
export const ItinerariesLayer = data => {

  return data.map(({ author, trajectory}) => new ArcLayer({
    id: `${author}/trajectory`, 
    data: trajectory,
    pickable: false,
    getWidth: 1.5,
    getSourcePosition: d => d.from.coordinates,
    getTargetPosition: d => d.to.coordinates
  }));

}