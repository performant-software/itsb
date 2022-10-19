
import React, { useState, useEffect } from 'react';
import { GraphContext } from '@peripleo/peripleo';
import { ITSBGraph } from './itsbGraph';

export const ITSBGraphProvider = props => {

  const [ graph, setGraph ] = useState();

  useEffect(() => {
    const { authors, places, itineraries } = props;

    if (authors && places && itineraries) {
      const g = new ITSBGraph();
      g.init(authors, places, itineraries);
      setGraph(g);
    }
  }, [ props.authors, props.places, props.itineraries ]);
    
  return (
    <GraphContext.Provider value={graph}>
      {graph && props.children}
    </GraphContext.Provider>
  )
  
}