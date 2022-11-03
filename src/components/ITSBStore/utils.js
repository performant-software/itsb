/**
 * Just makes sure there's an 'id' prop on the graph node.
 */
export const normalizeNode = (n) => {
  if (n.id) return n;

  n.id = n['@id'];
  delete n['@id'];

  if (!n.id) throw { message: 'Missing node ID', node: n };

  return n;
};

/**
 * Generic method to group an array of objects by key
 *
 * https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
 */
export const groupBy = (xs, key) =>
  xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

/**
 * Split one itinerary to n waypoint nodes. The method
 * also sorts waypoints by time, to ensure correct sequence.
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
export const isTimespanInRange = (timespan, dateRange) => {
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
 * Returns the start date of this waypoint. Note that this
 * method will return null, if the waypoint has no start specified.
 *
 * @param {*} waypoint
 * @returns the start date, if any
 */
export const getWaypointStart = (waypoint) => {
  if (!waypoint.when?.timespans) return;

  if (waypoint.when.timespans.length === 0) return;

  const startSpan = waypoint.when.timespans.find((t) => t.start)?.start;
  return startSpan && new Date(startSpan.in || startSpan.earliest || startSpan.latest);
};

/**
 * Returns the end date of this waypoint. Note that this
 * method will return null, if the waypoint has no end specified.
 *
 * @param {*} waypoint
 * @returns the end date, if any
 */
export const getWaypointEnd = (waypoint) => {
  if (!waypoint.when?.timespans) return;

  if (waypoint.when.timespans.length === 0) return;

  const endSpan = waypoint.when.timespans.find((t) => t.end)?.end;
  return endSpan && new Date(endSpan.in || endSpan.latest || endSpan.earliest);
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
  const start = getWaypointStart(waypoint);
  const end = getWaypointEnd(waypoint);

  if (start || end) {
    return [
      start || end, // Start date, but fallback to end if none
      end || start, // End date, but fallback to start if none
    ];
  }
};
