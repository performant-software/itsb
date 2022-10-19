/** Just makes sure there's an 'id' prop on the node **/
export const normalizeNode = n => {
  if (n.id) 
    return n;

  n.id = n['@id'];
  delete n['@id'];

  if (!n.id)
    throw { message: 'Missing node ID', node: n };

  return n;
}

/** Convert one itinerary to n waypoint nodes **/
export const splitItinerary = it => {
  const itineraryId = it.id;
  const authorId = it.target[0].id;
  const waypointList = it.body.value;

  // Work around a conceptual difference between LP and our
  // graph model: 'id' in LP refers to the place; but it 
  // identifies the waypoint node itself in our graph!
  return waypointList.map((value, idx) => ({
    ...value,
    author: authorId,
    place: value.id,
    type: 'waypoint',
    id: `${itineraryId}/wp/${idx}`
  }));
}

/** 
 * Sorts waypoints in sequence by traversing the graph.
 */
export const sortWaypoints = (waypoints, graph) => {
  const ids = new Set(waypoints.map(wp => wp.id));

  // The start point is the WP with either no previous
  // WP, or no previous WP in the ID set. (The ID set)
  // only includes those WPs that fall within the 
  // selected time range
  const startPoint = waypoints.find(wp => {
    let previous;

    graph.forEachLinkedNode(wp.id, (_, link) => {
      if (link.data.relation === 'previous')
        previous = link.toId;
    }, true);

    return !previous || !ids.has(previous);
  });

  const traverseItinerary = (waypoint, sorted = []) => {
    let nextNode;

    graph.forEachLinkedNode(waypoint.id, (node, link) => {
      if (link.data.relation == 'previous' && link.toId === waypoint.id)
        nextNode = node.data;
    }, false);

    return nextNode ? traverseItinerary(nextNode, [...sorted, nextNode]) : sorted;
  }

  return traverseItinerary(startPoint);    
}

/** 
 * Generic method to group an array of objects by key
 * 
 * https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
 */
export const groupBy = (xs, key) => xs.reduce((rv, x) => {
  (rv[x[key]] = rv[x[key]] || []).push(x);
  return rv;
}, {});

export const filterByTime = (waypoints, dateRange) => {
  const [ startDate, endDate ] = dateRange;

  // check if a timespan (object with {start} or {end})
  // is in a date range (array of Dates of length 2)
  const timespanInRange = timespan => {
    if (timespan.start) {
      const date = new Date(timespan.start.earliest || timespan.start.in);
      return date >= startDate && date <= endDate;
    } else {
      const date = new Date(timespan.end.latest || timespan.end.in);
      return date >= startDate && date <= endDate;
    }
  }

  return waypoints.filter(waypoint => 
    waypoint.when.timespans
      .map(timespanInRange)
      .every(Boolean)); // i.e. all timespans evaluate to true  
}
