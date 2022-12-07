import { isAfter } from 'date-fns';
import {
  getWaypointEndDate,
  getWaypointEndValue,
  getWaypointStartDate,
  getWaypointStartValue,
} from './waypointUtils';

/**
 * Time interval inference for waypoints, according to the meeting with Alex Gil
 * on Nov 3 2022. Modified (by Rainer Simon) from the initial version at
 * https://github.com/elotroalex/itsb/blob/5be23bf8abd459cbd0cf414687b108b56beaaea0/python/GenerateJson.py#L380-L430
 *
 * ---
 * Score of 3
 * If we have both a start date and an end date for a given location, then the author was very
 * likely in that place from that start date through that end date, so she appears in that location
 * throughout that date range with a likelihood score of 3.
 *
 * If we only have a start date (or an end date) for a given place, then we look at the next
 * (or previous) waypoint of the itinerary to help figure out the likely time range. The time
 * range is assigned a likelihood score of 2 or 1, as follows:
 *
 * Score of 2
 * If we have a START DATE (arrival or earliest presence) at the current waypoint, and the author
 * has a known ARRIVAL DATE at the next location, she was likely at the current waypoint between
 * START DATE and next ARRIVAL DATE. We assign this date range a likelihood of 2.
 *
 * Likewise, if we have an END DATE (departure or lastest presence) at the current waypoint, and
 * the author has a known DEPARTURE DATE at the previous location, we assign the date range (DEPARTURE DATE,
 * END DATE) a likelihood of 2.
 *
 * Score of 1
 * If we have a known START DATE (arrival or earliest) at the current waypoint, and a known
 * EARLIEST date at the next waypoint (but no ARRIVAL DATE!), she may have been at the current
 * waypoint between START DATE and EARLIEST next date. We assign this likelihood a score of 1.
 *
 * Likewise, if we have a known END DATE at the current waypoint (latest or departure), and a
 * known LATEST date at the previous waypoint, we assign the interval (LATEST previous, END DATE)
 * a likelihood of 1.
 *
 * ---
 *
 * The return type of the method is an object of the following shape:
 *
 * {
 *   'waypoint': ... // the waypoint (for convenience)
 *   'start': ... // Start (type = Date)
 *   'end': ... // End (type = Date)
 *   'likelihood': ... // The inferred likelihood (type = number, value = 1, 2 or 3)
 * }
 *
 * @param {object} waypoint the Waypoint
 * @param {ITSBGraph} graph the ITSBGraph
 * @returns {object | void} the estimated interval, or undefined if not possible
 */
export const estimateInterval = (waypoint, graph) => {
  if (!waypoint.when?.timespans) return;

  if (waypoint.when.timespans.length === 0) return;

  const start = getWaypointStartDate(waypoint);
  const end = getWaypointEndDate(waypoint);

  if (start && end) {
    if (isAfter(start, end)) {
      console.warn('Invalid time interval', start, 'to', end);
    } else {
      return { waypoint, start, end, likelihood: 3 };
    }
  } else {
    return inferInterval(waypoint, graph);
  }
};

/**
 * Helper method to infer the waypoint time interval, as outlined in the
 * documentation for `estimateInterval` (see above).
 *
 * @param {object} waypoint the Waypoint
 * @param {ITSBGraph} graph the ITSBGraph
 * @returns {object | void} the inferred interval, or undefined if not possible
 */
const inferInterval = (waypoint, graph) => {
  // Since this fn is internal, and only called from estimateTimeInterval,
  // we already know that max ONE of these is true!
  const thisStart = getWaypointStartDate(waypoint);
  const thisEnd = getWaypointEndDate(waypoint);

  if (thisStart) {
    const next = graph.getNextWaypoint(waypoint);

    if (next) {
      const nextStart = getWaypointStartDate(next) || getWaypointEndDate(next);
      const isArrival = !!getWaypointStartValue(next, 'in');
      if (nextStart) {
        if (isAfter(thisStart, nextStart)) {
          console.warn('Invalid time interval', thisStart, 'to', nextStart);
        } else {
          return { waypoint, start: thisStart, end: nextStart, likelihood: isArrival ? 2 : 1 };
        }
      }
    }
  } else if (thisEnd) {
    const previous = graph.getPreviousWaypoint(waypoint);

    if (previous) {
      const previousEnd = getWaypointEndDate(previous) || getWaypointStartDate(previous);
      const isDeparture = !!getWaypointEndValue(previous, 'in');

      if (previousEnd) {
        if (isAfter(previousEnd, thisEnd)) {
          console.warn('Invalid time interval', previousEnd, 'to', thisEnd);
        } else {
          return { waypoint, start: previousEnd, end: thisEnd, likelihood: isDeparture ? 2 : 1 };
        }
      }
    }
  }
};
