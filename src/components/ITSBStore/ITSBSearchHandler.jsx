import { useEffect } from 'react';
import { SearchStatus, useGraph, useSearch } from '@peripleo/peripleo';

/**
 * The SearchHandler handles one thing: translating a Search
 * into a list of results by querying the graph.
 */
export const ITSBSearchHandler = props => {

  const { search, setSearchState } = useSearch();

  const graph = useGraph();

  useEffect(() => {
    if (search.status === SearchStatus.PENDING) {
      const authors = 
        search.args.filters?.find(f => f.name === 'authors')?.values || [];

      const dateRange = 
        search.args.filters?.find(f => f.name === 'daterange')?.range;
      
      // TODO this could be optimized by filtering authors first!
      const itineraries = graph.listItineraries(dateRange)
        .filter(it => authors.includes(it.author));

      setSearchState({
        args: search.args,
        status: SearchStatus.OK,
        result: {
          total: itineraries.length,
          items: itineraries
        }
      });
    }
  }, [search]);

  useEffect(() => {
    // Trigger initial search
    setSearchState({ args: {}, status: SearchStatus.PENDING });
  }, [graph]);

  return props.children;

}