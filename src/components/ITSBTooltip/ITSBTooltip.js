export const ITSBTooltip = (props) => {
  const { object, graph } = props;

  if (object && graph) {
    const { present } = object;
    if (present) {
      // present means this tooltip is for intersections viz
      const people = Object.entries(present)
        .map(([authorId, likelihoods]) => {
          const authorName = graph.getNode(authorId).name;

          // right now this is just showing likelihoods, for debugging
          return `${authorName}: ${Array.from(likelihoods).join(', ')}`;
        })
        .join('\n');

      return `${object.properties.title}\n\n${people}`;
    } else {
      // otherwise, just use the location's title as the tooltip
      return object.properties.title;
    }
  }
};
