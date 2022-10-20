export const ITSBTooltip = props => {

  const { object, graph } = props;

  if (object) {
    const { present } = object;

    const people = Object.entries(present)
      .map(([ authorId, likelihoods ]) => {
        const authorName = graph.getNode(authorId).name;


        // right now this is just showing likelihoods, for debugging
        return `${authorName}: ${Array.from(likelihoods).join(', ')}`;
      }).join('\n');
      
    return `${object.properties.title}\n\n${people}`;
  }

}