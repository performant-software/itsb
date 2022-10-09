import React from 'react';
import { ITSBSearchHandler } from './ITSBSearchHandler';
import { ITSBGraphProvider } from './ITSBGraphProvider';

export const ITSBStore = props => {

  return (
    <ITSBGraphProvider>
      <ITSBSearchHandler>
        {props.children}
      </ITSBSearchHandler>
    </ITSBGraphProvider>
  )

}