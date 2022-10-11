import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { searchState, SearchStatus } from '@peripleo/peripleo';
import { useGraph } from '@peripleo/peripleo';

export const ITSBSearchHandler = props => {

  const [search, setSearchState] = useRecoilState(searchState);

  const graph = useGraph();

  useEffect(() => {
    if (search.status === SearchStatus.PENDING) {
      console.log('Running search');

      // Main task of the SearchHandler ist to turn itineraries
      // into map-able GeoJSON
      const itineraries = graph.listItineraries(true);

      console.log(itineraries)

    }
  }, [search]);

  useEffect(() => {
    // Trigger initial search
    setSearchState({ args: {}, status: SearchStatus.PENDING });
  }, [graph]);

  return props.children;

}