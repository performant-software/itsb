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
    id: `${itineraryId}/wp/${idx}`
  }));
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