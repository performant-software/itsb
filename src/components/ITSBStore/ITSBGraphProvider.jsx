
import React, { useMemo } from 'react';
import { GraphContext } from '../../peripleo/store';
import { ITSBGraph } from './itsbGraph';

export const ITSBGraphProvider = props => {

  const graph = useMemo(() => {
    const { authors, places, itineraries } = props;

    if (authors && places && itineraries) {
      const g = new ITSBGraph();
      g.init(authors, places, itineraries);
      return g;
    }
  }, [ props.authors, props.places, props.itineraries ]);
    
  return (
    <GraphContext.Provider value={graph}>
      {graph && props.children}
    </GraphContext.Provider>
  )
  
}