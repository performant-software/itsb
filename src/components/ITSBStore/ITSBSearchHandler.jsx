import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { searchState, SearchStatus } from '@peripleo/peripleo';

export const ITSBSearchHandler = props => {

  const [search, setSearchState] = useRecoilState(searchState);

  useEffect(() => {
    if (search.status === SearchStatus.PENDING) {
      console.log('Running search');

      // TODO

    }
  }, [search]);

  return props.children;

}