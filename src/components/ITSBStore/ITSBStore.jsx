import React from 'react';
import { ITSBSearchHandler } from './ITSBSearchHandler';
import { ITSBGraphProvider } from './ITSBGraphProvider';

export const ITSBStore = props => {

  console.log('store', props);

  return (
    <ITSBGraphProvider {...props}>
      <ITSBSearchHandler>
        {props.children}
      </ITSBSearchHandler>
    </ITSBGraphProvider>
  )

}