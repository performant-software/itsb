import { useGraph, useSearch } from '@peripleo/peripleo';
import { estimateInterval, formatInterval } from '../../components/ITSBStore/utils';

import './IntersectionDetails.css';

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

  const getLikelihood = (waypoint) => estimateInterval(waypoint, graph).likelihood;

  return (
    at && (
      <div className="intersection-details">
        <h1>{at.properties.title}</h1>
        <ul>
          {waypointsAtThisPlace.map((wp) => (
            <li key={wp.id} className={`likelihood-${getLikelihood(wp)}`}>
              <span className="wp-author">{graph.getNode(wp.author).name}</span>{' '}
              <span className="wp-interval">{formatInterval(wp)}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  );
};
