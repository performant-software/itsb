/**
 * In Linked Places/Traces, IDs are sometimes expressed as 'id', and
 * sometimes as '@id'. This method just does minimal normalization
 * to ensure the id is always expressed as an 'id' property.
 *
 * @param {*} n the graph node
 * @returns {*} the same node (modified in place if needed), normalized
 */
export const normalizeNode = (n) => {
  if (n.id) return n;

  n.id = n['@id'];
  delete n['@id'];

  if (!n.id) throw { message: 'Missing node ID', node: n };

  return n;
};

/**
 * Generic method to group an array of objects by key.
 * https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
 *
 * Returns a map-like object where the keys are the values for the given key value, and
 * the values are lists of objects. Example: if you are grouping a list of waypoints
 * by their 'author' field, the method will return an object of the following shape:
 *
 * {
 *   'author_1': [ waypoint, waypoint, ... ],
 *   'author_2': [ waypoint, waypoint, ... ],
 *   'author_3': [ waypoint, waypoint, ... ],
 *   'author_4': [ waypoint, waypoint, ... ]
 * }
 *
 * @param {Array<*>} xs the array of objects
 * @param {*} key the object key to group by
 * @returns {object} a map-like object
 */
export const groupBy = (xs, key) =>
  xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
