import { useEffect } from 'react';
import { SearchStatus, useGraph, useSearch } from '@peripleo/peripleo';

/**
 * The ITSBSearchHandler observes changes to the Peripleo search state,
 * and executes searchs (using the graph) if the search changes to
 * a PENDING state.
 *
 * @typedef {object} Props
 * @property {ReactElement} children child components
 * @param {Props} props
 * @returns {ReactElement}
 * @property
 */
export const ITSBSearchHandler = (props) => {
  const { search, setSearchState } = useSearch();

  const graph = useGraph();

  useEffect(() => {
    if (search.status === SearchStatus.PENDING) {
      const authors = search.args.filters?.find((f) => f.name === 'authors')?.values || [];

      const dateRange = search.args.filters?.find((f) => f.name === 'daterange')?.range;

      // TODO this could be optimized by filtering authors first!
      const itineraries = graph
        .listItineraries(dateRange)
        .filter((it) => authors.includes(it.author));

      setSearchState({
        args: search.args,
        status: SearchStatus.OK,
        result: {
          total: itineraries.length,
          items: itineraries,
        },
      });
    }
  }, [search]);

  useEffect(() => {
    // Trigger initial search
    setSearchState({ args: {}, status: SearchStatus.PENDING });
  }, [graph]);

  return props.children;
};
