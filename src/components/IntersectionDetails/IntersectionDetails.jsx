import { useGraph, useSearch } from '@peripleo/peripleo';
import {
  estimateInterval,
  formatInterval,
  sortWaypointsByTime,
  waypointsAtPlace,
} from '../../components/ITSBStore/utils';

import './IntersectionDetails.css';

/**
 * @typedef {object} IntersectionDetailProps
 * @property {object} at the current place (GeoJSON)
 *
 * IntersectionDetails renders waypoint descriptions, to accompany the map.
 * We are using this component in the sidebar of the "Intersections" page.
 * @param {IntersectionDetailProps} props the component props
 * @returns {React.ReactElement} the React element
 */
export const IntersectionDetails = (props) => {
  const { at } = props;

  const graph = useGraph();

  const { search } = useSearch();

  // Itineraries in the current search (filtered by author and time)
  const itineraries = at ? search.result?.items : null;

  // Get all waypoints on this place, sort them by time
  const sorted = sortWaypointsByTime(waypointsAtPlace(itineraries, at?.id));

  /**
   * Helper method to get the likelihood of presence for a waypoint.
   *
   * @param {object} waypoint A waypoint
   * @returns {number} Likelihood as a number between 1 and 3
   */
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
