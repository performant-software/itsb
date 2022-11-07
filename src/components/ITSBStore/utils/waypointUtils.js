/**
 * The method sorts waypoints according to the time
 * given in the `when` element.
 *
 * @param {*} waypoints
 * @returns the waypoints, sorted by time
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
 * Sorts waypoints in sequence by traversing the graph.
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
 * Helper to check if a timespan (object with {start} and/or {end})
 * is in a date range (array of Dates of length 2)
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
};

/**
 * Filters the list of waypoints by the given date range.
 *
 * @param {*} waypoints
 * @param {*} dateRange
 * @returns the list of waypoints in the given time interval
 */
export const filterWaypointsByTime = (waypoints, dateRange) => {
  return waypoints.filter((waypoint) =>
    waypoint.when.timespans.map((t) => isTimespanInRange(t, dateRange)).every(Boolean)
  ); // i.e. all timespans evaluate to true
};

/**
 * Returns the start time of this waypoint. The method returns
 * the verbatim string value from the waypoint object. Note that this
 * method will return null, if the waypoint has no start specified.
 *
 * Optionally, a `qualifier` (in, latest, earliest) can be provided. In
 * this case, the method will return the value for this specific qualifier,
 * if it exists, or null otherwise.
 *
 * @param {*} waypoint
 * @param {boolean} qualifier an optional qualifier
 * @returns the start date, if any
 */
export const getWaypointStartValue = (waypoint, qualifier = null) => {
  if (!waypoint.when?.timespans) return;

  if (waypoint.when.timespans.length === 0) return;

  const startSpan = waypoint.when.timespans.find((t) => t.start)?.start;
  return startSpan
    ? qualifier
      ? startSpan[qualifier]
      : startSpan.in || startSpan.earliest || startSpan.latest
    : null;
};

/**
 * Returns the end time of this waypoint. The method returns
 * the verbatim string value from the waypoint object. Note that this
 * method will return null, if the waypoint has no end specified.
 *
 * Optionally, a `qualifier` (in, latest, earliest) can be provided. In
 * this case, the method will return the value for this specific qualifier,
 * if it exists, or null otherwise.
 *
 * @param {*} waypoint
 * @param {boolean} qualifier an optional qualifier
 * @returns the end date, if any
 */
export const getWaypointEndValue = (waypoint, qualifier = null) => {
  if (!waypoint.when?.timespans) return;

  if (waypoint.when.timespans.length === 0) return;

  const endSpan = waypoint.when.timespans.find((t) => t.end)?.end;

  return endSpan
    ? qualifier
      ? endSpan[qualifier]
      : endSpan.in || endSpan.latest || endSpan.earliest
    : null;
};

/**
 * Returns the start of this waypoint as a Date object. Note that this
 * method will return null, if the waypoint has no start specified.
 *
 * @param {*} waypoint
 * @returns the start date, if any
 */
export const getWaypointStartDate = (waypoint) => {
  const startVal = getWaypointStartValue(waypoint);
  return startVal ? new Date(startVal) : null;
};

/**
 * Returns the end date of this waypoint as a Date object. Note that this
 * method will return null, if the waypoint has no end specified.
 *
 * @param {*} waypoint
 * @returns the end date, if any
 */
export const getWaypointEndDate = (waypoint) => {
  const endVal = getWaypointEndValue(waypoint);
  return endVal ? new Date(endVal) : null;
};

/**
 * Helper function to get the start/end interval for the
 * given waypoint. Note that this method will fill in blanks!
 * E.g. if the waypoint has no end date, but a start date, the
 * interval returned will be [ start, start ].
 *
 * The method will return null if the waypoint has neither
 * start nor end.
 *
 * @param {*} waypoint
 * @returns a valid start/end interval or null
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
 * @param {*} waypoint
 * @returns formatted string representation
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
