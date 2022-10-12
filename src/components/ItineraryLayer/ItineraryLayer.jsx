import { ArcLayer } from '@deck.gl/layers';
import { useGraph } from '@peripleo/peripleo';

/**
 * The task of the ItineraryLayer is to take a search result,
 * and turn the itinerary trajectories into a DeckGL layer
 */
export const ItineraryLayer = props => {

  const graph = useGraph();

  const layers = props.data.map(({ author, trajectory }) => 
    <ArcLayer 
      id={`arc-layer-${author}`} 
      key={author}
      data={trajectory} /> 
  );
  
  return {layers};

}