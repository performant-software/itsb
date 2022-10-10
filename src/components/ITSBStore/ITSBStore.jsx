import React from 'react';
import { ITSBSearchHandler } from './ITSBSearchHandler';
import { ITSBGraphProvider } from './ITSBGraphProvider';

export const ITSBStore = props => {

  return (
    <ITSBGraphProvider {...props}>
      <ITSBSearchHandler>
        {props.children}
      </ITSBSearchHandler>
    </ITSBGraphProvider>
  )

}