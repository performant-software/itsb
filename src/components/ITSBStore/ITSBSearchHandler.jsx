import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { searchState, SearchStatus } from '../../peripleo/store';
import { useGraph } from '../../peripleo/store';

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
      // TODO support actual search (not just 'listAll')
      const itineraries = graph.listItineraries(true)
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

  // Just a hack for testing!
  const randomSearch = () => {
    const i = graph.listItineraries(true);

    const random = [
      i[Math.floor(Math.random() * i.length)]
    ].map(({ author, waypoints }) => {
      const arc = toArc(waypoints, graph);
      return { author, trajectory: arc };
    });

    setSearchState({
      args: search.args,
      status: SearchStatus.OK,
      result: {
        total: 1,
        items: random
      }
    });
  }

  return (
    <>
      <button onClick={randomSearch} className="random-search">Random Itinerary</button>
      {props.children}
    </>
  )

}