import { formatInterval, groupBy, sortWaypointsByTime, waypointsAtPlace } from '../ITSBStore';

/**
 * Generate tooltip markup for a waypoint in an itinerary, or a place with
 * intersecitons.
 *
 * @param {object} props Arguments object to destructure
 * @param {ITSBGraph} props.graph The ITSB graph context provider
 * @param {object} props.object The currently selected waypoint
 * @param {SearchState} props.search The ITSB search context provider
 * @returns {string | object | void} The tooltip text, if possible
 */
export function ITSBTooltip({ graph, object, search }) {
  if (object?.present) {
    // present means this tooltip is for intersections; just use place name
    return object.properties?.title;
  } else if (object) {
    // for trajectories, show place name and labeled waypoints
    const selected = [`<h2>${object.properties?.title || 'Place'}</h2>`, '<ul>'];

    // Get all waypoints on this place, sort them by time
    const sorted = sortWaypointsByTime(waypointsAtPlace(search.result.items, object.id));
    const unlabeled = sorted.filter((waypoint) => !waypoint.relation?.label);
    const anyHasLabel = unlabeled.length !== sorted.length;
    sorted.forEach((waypoint) => {
      const { author, relation, when } = waypoint;
      // if this waypoint has relation.label or NONE on this place do, then
      // add it to the tooltip.
      // if some waypoint on this place has relation.label but this one does
      // not, skip this waypoint. (will group unlabeled waypoints later)
      if (relation.label || !anyHasLabel) {
        const { name } = graph.getNode(author);
        // format is "Name: Label (StartDate–EndDate)"
        let label = relation.label ? `${name}: ${relation.label}` : name;
        if (when.timespans.length) {
          label = `${label} (${formatInterval(waypoint)})`;
        }
        selected.push(`<li>${label}</li>`);
      }
    });
    // If some waypoints in this place/date range have labels, group all the unlabeled
    // waypoints by author and append a count of each author's unlabeled visits.
    if (anyHasLabel && unlabeled.length) {
      const unlabeledByAuthor = groupBy(unlabeled, 'author');
      Object.keys(unlabeledByAuthor).forEach((author) => {
        const { name } = graph.getNode(author);
        selected.push(
          `<li>+ ${unlabeledByAuthor[author].length} additional visit(s) by ${name}</li>`
        );
      });
    }
    selected.push('</ul>');
    return { html: selected.join('\n') };
  }
}
