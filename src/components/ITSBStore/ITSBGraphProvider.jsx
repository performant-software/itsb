
import React from 'react';
import { GraphContext } from '@peripleo/peripleo';

export const ITSBGraphProvider = props => {

  const graphProvider = {

    getNodeById: id => {
      // TODO
      return null;
    },
  
    getConnected: uri => {
      // TODO
      return new Promise(resolve => resolve(null));
    }

  };

  return (
    <GraphContext.Provider value={graphProvider}>
      {props.children}
    </GraphContext.Provider>
  )
  
}