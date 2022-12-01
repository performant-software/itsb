import { sortWaypointsByTime } from '../ITSBStore';

/**
 * Format the date by moving the year to the end and changing dash delimiters
 * to slashes; or return a question mark if there is no date.
 *
 * @param {string} date The date as a string formatted YYYY-MM-DD.
 * @returns {string} Date formatted MM/DD/YYYY.
 */
function fmt(date) {
  const split = date?.split('-');
  if (split?.length) {
    split.push(split.shift());
  }
  return split?.join('/') || '?';
}

/**
 * Generate tooltip markup for a waypoint in an itinerary, or a place with
 * intersecitons.
 *
 * @param {*} props Arguments object to destructure
 * @param {*} props.graph The ITSB graph context provider
 * @param {*} props.object The currently selected waypoint
 * @param {*} props.search The ITSB search context provider
 * @returns {string|undefined} The tooltip text, if possible
 */
export function ITSBTooltip({ graph, object, search }) {
  if (object?.present) {
    // present means this tooltip is for intersections; just use place name
    return object.properties?.title;
  } else if (object) {
    // for trajectories, show place name and labeled waypoints
    const selected = [`<h2>${object.properties?.title || 'Place'}</h2>`, '<ul>'];

    // Get all waypoints on this place
    const waypointsAtThisPlace = search.result.items?.reduce((all, it) => {
      const { waypoints } = it;
      return [...all, ...waypoints.filter((wp) => wp.place === object.id)];
    }, []);
    // sort them by time
    const sorted = waypointsAtThisPlace && sortWaypointsByTime(waypointsAtThisPlace);
    const anyHasLabel = sorted.some((waypoint) => waypoint.relation?.label);
    sorted.forEach((waypoint) => {
      const { author, relation, when } = waypoint;
      // if this waypoint has relation.label or NONE on this place do, then
      // add it to the tooltip.
      // if some waypoint on this place has relation.label but this one does
      // not, skip this waypoint.
      if (relation.label || !anyHasLabel) {
        const { name } = graph.getNode(author);
        // format is "Name: Label (StartDate–EndDate)"
        let label = relation.label ? `${name}: ${relation.label}` : name;
        if (when.timespans.length) {
          const { start, end } = when.timespans[0];
          const startDate = start?.in || start?.earliest;
          const endDate = end?.in || end?.latest;
          label = `${label} (${fmt(startDate)}–${fmt(endDate)})`;
        }
        selected.push(`<li>${label}</li>`);
      }
    });
    selected.push('</ul>');
    return { html: selected.join('\n') };
  }
}
