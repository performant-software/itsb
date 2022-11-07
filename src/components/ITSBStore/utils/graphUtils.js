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
