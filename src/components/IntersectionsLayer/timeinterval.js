import { isAfter } from 'date-fns';

/**
 * Time interval inference for waypoints. See below for Alex Gil's original
 * description:
 * 
 * ---
 * Processes each movement for the intersections json and assigns likelihood scores for each location.
 * These comments are written using Lydia Cabrera as an example.
 * 
 * Score of 3
 * If we have both a start date and an end date for a given location,
 * then Cabrera was very likely in that place from that start date through that end date,
 * so she appears in that location throughout that date range with a likelihood score of 3.
 * If we only have a start date or an end date for a given place, then we look at the previous row to help figure out
 * Cabrera's likely locations and assign likelihood scores of 2 or 1 for where Cabrera could be, as follows:
 * 
 * Score of 2
 * If Cabrera had unterminated time in New York City (meaning an arrival, an earliest presence, or a latest presence),
 * and then arrived in Miami, we say she was likely in New York City (with a score of 2) until her arrival in Miami.
 * If Cabrera had a departure from Havana followed by an earliest presence, latest presence, or departure from Miami,
 * we say she was likely in Miami (with a score of 2) from her Havana departure to her know date in Miami.
 * 
 * Score of 1
 * If it is possible that Cabrera could have been in any one of two places,
 * then she placed in both locations with a likelihood score of 1 for each.
 * 
 * https://github.com/elotroalex/itsb/blob/5be23bf8abd459cbd0cf414687b108b56beaaea0/python/GenerateJson.py#L380-L430
 */
export const getTimeInterval = (waypoint, graph) => {
  if (!waypoint.when?.timespans)
    return;

  if (waypoint.when.timespans.length === 0)
    return;

  const start = getStart(waypoint);
  const end = getEnd(waypoint);

  if (start && end) {
    if (isAfter(start, end)) {
      console.warn('Invalid time interval', start, 'to', end);
    } else {
      return { waypoint, start, end, likelihood: 3 };
    }
  } else {
    return inferInterval(waypoint, graph);
  }
}

const getStart = waypoint => {
  if (!waypoint.when?.timespans)
    return;

  if (waypoint.when.timespans.length === 0)
    return;

  const startSpan = waypoint.when.timespans.find(t => t.start)?.start;
  return startSpan && new Date(startSpan.in || startSpan.earliest || startSpan.latest);
}

const getEnd = waypoint => {
  if (!waypoint.when?.timespans)
    return;

  if (waypoint.when.timespans.length === 0)
    return;

  const endSpan = waypoint.when.timespans.find(t => t.end)?.end;
  return endSpan && new Date(endSpan.in || endSpan.latest || endSpan.earliest);
}

const inferInterval = (waypoint, graph) => {
  // Since this fn is internal, and only called from getTimeInterval,
  // we already know that max ONE of these is true!
  const thisStart = getStart(waypoint);
  const thisEnd = getEnd(waypoint);

  if (thisStart) {
    // New York example: use next WP to infer time here
    const next = graph.getNextWaypoint(waypoint);

    if (next) {
      const nextStart = getStart(next) || getEnd(next);
      if (nextStart) {
        if (isAfter(thisStart, nextStart)) {
          console.warn('Invalid time interval', thisStart, 'to', nextStart);
        } else {
          return { waypoint, start: thisStart, end: nextStart, likelihood: 2 };
        }
      }
    }
  } else if (thisEnd) {
    const previous = graph.getPreviousWaypoint(waypoint);

    if (previous) {
      const previousEnd = getEnd(previous);
      const previousStart = getStart(previous);

      if (previousEnd) {
        if (isAfter(previousEnd, thisEnd)) {
          console.warn('Invalid time interval', previousEnd, 'to', thisEnd);
        } else {
          return { waypoint, start: previousEnd, end: thisEnd, likelihood: 2 };
        }
      } else if (previousStart) {
        if (isAfter(previousStart, thisEnd)) {
          console.warn('Invalid time interval', previousStart, 'to', thisEnd);
        } else {
          return { waypoint, start: previousStart, end: thisEnd, likelihood: 1 };
        }
      }
    }
  }
}