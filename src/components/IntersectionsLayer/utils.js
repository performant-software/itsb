import { isAfter } from 'date-fns';

export const getTimeInterval = (waypoint, graph) => {
  if (!waypoint.when?.timespans)
    return;

  if (waypoint.when.timespans.length === 0)
    return;

  // Timespans array has any entries with start and end
  const isFullyDefined = ['start', 'end'].every(key =>
    timespans.some(span => Object.hasOwn(span, key)));

  if (isFullyDefined) {
    const startSpan = timespans.find(t => t.start).start;
    const start = new Date(startSpan.in || startSpan.earliest || startSpan.latest);

    const endSpan = timespans.find(t => t.end).end;
    const end = new Date(endSpan.in || endSpan.latest || endSpan.earliest);

    if (isAfter(start, end))
      throw `Invalid time interval: ${start} - ${end}`;

    return { waypoint, start, end };
  } else {
    return inferInterval(waypoint, graph);
  }
}

const inferInterval = (waypoint, graph) => {

}