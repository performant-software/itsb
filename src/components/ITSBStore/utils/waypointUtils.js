/**
 * The method sorts waypoints according to the time
 * given in the `when` element.
 *
 * @param {Array<object>} waypoints the Waypoints (unsorted)
 * @returns {Array<object>} the Waypoints, sorted by time
 */
export const sortWaypointsByTime = (waypoints) => {
  const sorted = [...waypoints];

  sorted.sort((a, b) => {
    const [startA, endA] = getWaypointInterval(a);
    const [startB, endB] = getWaypointInterval(b);

    // May be overlapping, but A starts first and ends first
    const isABeforeB = startA <= startB && endA <= endB;

    // Same, but reversed A -> B
    const isBBeforeA = startB <= startA && endB <= endA;

    if (isABeforeB) {
      return -1;
    } else if (isBBeforeA) {
      return 1;
    } else {
      // A inside B or vice versa - sort by whichever starts first
      return startA <= startB ? -1 : 1;
    }
  });

  return sorted;
};

/**
 * Sorts waypoints in the sequence represented in the graph.
 *
 * @param {Array<object>} waypoints the Waypoints
 * @param {ITSBGraph} graph the ITSBGraph
 * @returns {Array<object>} the Waypoints, sorted by sequence
 */
export const sortWaypointsBySequence = (waypoints, graph) => {
  const ids = new Set(waypoints.map((wp) => wp.id));

  // The start point is the WP with either no previous
  // WP, or no previous WP in the ID set. (The ID set)
  // only includes those WPs that fall within the
  // selected time range
  const startPoint = waypoints.find((wp) => {
    let previous;

    graph.forEachLinkedNode(
      wp.id,
      (_, link) => {
        if (link.data.relation === 'previous') previous = link.toId;
      },
      true
    );

    return !previous || !ids.has(previous);
  });

  /**
   * Traverse an itinerary in order from a starting waypoint by following links
   * in the graph.
   *
   * @param {object} waypoint Starting waypoint
   * @param {Array<object>} sorted Sorted waypoints so far
   * @returns {Array<object>} Sorted waypoints
   */
  const traverseItinerary = (waypoint, sorted = [waypoint]) => {
    let nextNode;

    graph.forEachLinkedNode(
      waypoint.id,
      (node, link) => {
        if (link.data.relation == 'previous' && link.toId === waypoint.id) nextNode = node.data;
      },
      false
    );

    return nextNode ? traverseItinerary(nextNode, [...sorted, nextNode]) : sorted;
  };

  return traverseItinerary(startPoint).filter((w) => ids.has(w.id));
};

/**
 * Checks if a 'when'-timespan (object with {start} and/or {end})
 * is in the given date range. The format of the date range is the same
 * as used in ITSBSearchHandler, i.e. an array of two ISO-formatted strings.
 *
 * The method returns true under different conditions:
 * - If the the timespan has a defined start AND end, the method returns
 *   true if the timespan is FULLY INCLUDED in the date range. (I.e. it's
 *   not enough if the timespan only intersects).
 * - If the timespan has ONLY a start OR end date, the method returns true
 *   if the defined start or end date is inside the given date range.
 *
 * @param {object} timespan the timespan, in LinkedPlaces 'when' format
 * @param {[string, string]} dateRange the date range, ISO-formatted start and end
 * @returns {boolean} true if the timespan is in the given date range
 */
const isTimespanInRange = (timespan, dateRange) => {
  const [startDate, endDate] = dateRange;
  if (timespan.start && timespan.end) {
    const timespanStart = new Date(timespan.start.earliest || timespan.start.in);
    const timespanEnd = new Date(timespan.end.latest || timespan.end.in);
    return timespanStart >= new Date(startDate) && timespanEnd <= new Date(endDate);
  } else if (timespan.start) {
    const date = new Date(timespan.start.earliest || timespan.start.in);
    return date >= new Date(startDate) && date <= new Date(endDate);
  } else if (timespan.end) {
    const date = new Date(timespan.end.latest || timespan.end.in);
    return date >= new Date(startDate) && date <= new Date(endDate);
  }
  return false;
};

/**
 * Filters the list of waypoints by the given date range, using the
 * method `isTimespanInRange` above.
 *
 * @param {Array<object>} waypoints the Waypoints
 * @param {[string, string]} dateRange the date range
 * @returns {Array<object>} the list of Waypoints inside the given time interval
 */
export const filterWaypointsByTime = (waypoints, dateRange) => {
  return waypoints.filter((waypoint) =>
    waypoint.when.timespans.map((t) => isTimespanInRange(t, dateRange)).every(Boolean)
  ); // i.e. all timespans evaluate to true
};

/**
 * Returns the start time of this waypoint. The method returns
 * the VERBATIM string value from the waypoint object, as included in
 * the 'when' object. Note that this method will return undefined if
 * the waypoint has no start specified.
 *
 * Optionally, a `qualifier` ('in', 'latest', or 'earliest') can be provided.
 * In this case, the method will return the value for this specific qualifier
 * if it exists, or undefined otherwise.
 *
 * @param {object} waypoint the Waypoint
 * @param {string} qualifier an optional qualifier
 * @returns {string | null} the start date, or null
 */
export const getWaypointStartValue = (waypoint, qualifier = null) => {
  if (!waypoint.when?.timespans) return null;

  if (waypoint.when.timespans.length === 0) return null;

  const startSpan = waypoint.when.timespans.find((t) => t.start)?.start;
  return startSpan
    ? qualifier
      ? startSpan[qualifier]
      : startSpan.in || startSpan.earliest || startSpan.latest
    : null;
};

/**
 * Returns the end time of this waypoint. The method returns
 * the VERBATIM string value from the waypoint object, as included in
 * the 'when' object. Note that this method will return undefined if
 * the waypoint has no end specified.
 *
 * Optionally, a `qualifier` ('in', 'latest', or 'earliest') can be provided.
 * In this case, the method will return the value for this specific qualifier
 * if it exists, or undefined otherwise.
 *
 * @param {object} waypoint the Waypoint
 * @param {string} qualifier an optional qualifier
 * @returns {string | null} the end date, or undefined
 */
export const getWaypointEndValue = (waypoint, qualifier = null) => {
  if (!waypoint.when?.timespans) return null;

  if (waypoint.when.timespans.length === 0) return null;

  const endSpan = waypoint.when.timespans.find((t) => t.end)?.end;

  return endSpan
    ? qualifier
      ? endSpan[qualifier]
      : endSpan.in || endSpan.latest || endSpan.earliest
    : null;
};

/**
 * Returns the start of this waypoint as a Date object. Note that this
 * method will return undefined if the waypoint has no start specified.
 *
 * @param {object} waypoint the Waypoint
 * @returns {Date} the start date, or undefined
 */
export const getWaypointStartDate = (waypoint) => {
  const startVal = getWaypointStartValue(waypoint);
  return startVal ? new Date(startVal) : null;
};

/**
 * Returns the end date of this waypoint as a Date object. Note that this
 * method will return undefined, if the waypoint has no end specified.
 *
 * @param {object} waypoint A waypoint
 * @returns {Date} the end date, or undefined
 */
export const getWaypointEndDate = (waypoint) => {
  const endVal = getWaypointEndValue(waypoint);
  return endVal ? new Date(endVal) : null;
};

/**
 * Helper function to get the start/end interval for the
 * given waypoint.
 *
 * Note that this method will FILL BLANKS to ensure the return
 * value is a [Date, Date] array. E.g. if the waypoint has a start
 * date, but no end date, the return value will be [start, start].
 *
 * The method returns undefined if the waypoint has neither start nor end.
 *
 * @param {object} waypoint the Waypoint
 * @returns {Array<Date> | void} a valid start/end interval or undefined
 */
export const getWaypointInterval = (waypoint) => {
  const start = getWaypointStartDate(waypoint);
  const end = getWaypointEndDate(waypoint);

  if (start || end) {
    return [
      start || end, // Start date, but fallback to end if none
      end || start, // End date, but fallback to start if none
    ];
  }
};

/**
 * Returns a formatted string representation of the time
 * interval of this waypoint.
 *
 * @param {object} waypoint the Waypoint
 * @returns {string | void} formatted string representation
 */
export const formatInterval = (waypoint) => {
  const startVal = getWaypointStartValue(waypoint);
  const endVal = getWaypointEndValue(waypoint);

  if (startVal && endVal) {
    return `${startVal} – ${endVal}`;
  } else if (startVal || endVal) {
    return startVal || endVal;
  }
};
