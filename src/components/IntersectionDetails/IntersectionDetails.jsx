import { useGraph, useSearch } from '@peripleo/peripleo';
import {
  estimateInterval,
  formatInterval,
  sortWaypointsByTime,
} from '../../components/ITSBStore/utils';

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

  const sorted = waypointsAtThisPlace && sortWaypointsByTime(waypointsAtThisPlace);

  const getLikelihood = (waypoint) => estimateInterval(waypoint, graph)?.likelihood;

  return (
    <div className="intersection-details">
      {at ? (
        <>
          <h1>{at.properties.title}</h1>
          <ul>
            {sorted.map((wp) => (
              <li key={wp.id} className={`likelihood-${getLikelihood(wp)}`}>
                <span className="wp-author">{graph.getNode(wp.author).name}</span>{' '}
                <span className="wp-interval">{formatInterval(wp)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1>Select a city</h1>
          <p>Enable authors in the left panel to find their possible points of intersection.</p>
          <p>
            As cities of intersection appear on the map, click on a city to see the dates and
            likelihood of each author&apos;s presence.
          </p>
        </>
      )}
    </div>
  );
};
