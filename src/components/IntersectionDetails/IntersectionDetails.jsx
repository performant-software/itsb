import { useGraph, useSearch } from '@peripleo/peripleo';
import { formatInterval } from '../../components/ITSBStore/utils';

export const IntersectionDetails = (props) => {
  const { at } = props;

  const graph = useGraph();

  const { search } = useSearch();

  // Itineraries in the current search (filtered by author and time)
  const itineraries = at ? search.result?.items : null;

  // Get all waypoints on this place
  const waypointsAtThisPlace = itineraries?.reduce((all, it) => {
    const { waypoints } = it;
    return [...all, ...waypoints.filter((wp) => wp.place === at.id)];
  }, []);

  return (
    at && (
      <div className="intersection-details">
        <h1>{at.properties.title}</h1>
        <ul>
          {waypointsAtThisPlace.map((wp) => (
            <li key={wp.id}>
              {graph.getNode(wp.author).name} {formatInterval(wp)}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};
