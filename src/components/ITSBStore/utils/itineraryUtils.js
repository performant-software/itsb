import { sortWaypointsByTime } from './waypointUtils';

/**
 * Split one itinerary to n waypoint nodes. The method
 * also sorts waypoints by time, to ensure correct sequence.
 *
 * @param {*} it the Itinerary
 * @returns {Array<*>} the list of Waypoints
 */
export const splitItinerary = (it) => {
  const itineraryId = it.id;
  const authorId = it.target[0].id;
  const waypointList = it.body.value;

  // Work around a conceptual difference between LP and our
  // graph model: 'id' in LP refers to the place; but it
  // identifies the waypoint node itself in our graph!
  const waypoints = waypointList.map((value, idx) => ({
    ...value,
    author: authorId,
    place: value.id,
    type: 'waypoint',
    id: `${itineraryId}/wp/${idx}`,
  }));

  return sortWaypointsByTime(waypoints);
};

/**
 * Given a list of itineraries, return all the waypoints
 * at the passed place ID.
 *
 * @param {Array<*>|undefined} itineraries List of itineraries
 * @param {string} place Place ID to match
 * @returns {Array<*>} List of waypoints
 */
export const waypointsAtPlace = (itineraries, place) => {
  return (itineraries || []).reduce((all, it) => {
    const { waypoints } = it;
    return [...all, ...waypoints.filter((wp) => wp.place === place)];
  }, []);
};
