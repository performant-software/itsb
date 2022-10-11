import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { searchState, SearchStatus } from '@peripleo/peripleo';
import { useGraph } from '@peripleo/peripleo';

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

export const ITSBSearchHandler = props => {

  const [search, setSearchState] = useRecoilState(searchState);

  const graph = useGraph();

  useEffect(() => {
    if (search.status === SearchStatus.PENDING) {
      console.log('Running search');

      // Main task of the SearchHandler ist to turn itineraries
      // into map-able GeoJSON
      const itineraries = graph.listItineraries(true)
        .map(({ author, waypoints }) => {
          const arc = toArc(waypoints, graph);
          return { author, trajectory: arc };
        });

      
    }
  }, [search]);

  useEffect(() => {
    // Trigger initial search
    setSearchState({ args: {}, status: SearchStatus.PENDING });
  }, [graph]);

  return props.children;

}