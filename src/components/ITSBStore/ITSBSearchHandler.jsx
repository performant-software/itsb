import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { searchState, SearchStatus, useGraph } from '@peripleo/peripleo';

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
 * The SearchHandler handles one thing: translating a Search
 * into a list of results by querying the graph.
 */
export const ITSBSearchHandler = props => {

  const [search, setSearchState] = useRecoilState(searchState);

  const graph = useGraph();

  useEffect(() => {
    if (search.status === SearchStatus.PENDING) {
      const authors = search.args.filters ? 
        search.args.filters.find(f => f.name === 'authors')?.values : [];
      
      const itineraries = graph.listItineraries()
        .filter(it => authors.includes(it.author))
        .map(({ author, waypoints }) => {
          const arc = toArc(waypoints, graph);
          return { author, trajectory: arc };
        });

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