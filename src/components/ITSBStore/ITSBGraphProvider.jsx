
import React from 'react';
import { GraphContext } from '@peripleo/peripleo';
import { ITSBGraph } from './itsbGraph';

export const ITSBGraphProvider = props => {

  const graph = new ITSBGraph();

  const { authors, places, itineraries } = props;

  if (authors && places && itineraries) {
    graph.init(authors, places, itineraries);
  }

  return (
    <GraphContext.Provider value={graph}>
      {props.children}
    </GraphContext.Provider>
  )
  
}