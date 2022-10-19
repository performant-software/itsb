import { useState, useEffect } from 'react';
import Peripleo, { Map, Controls, ZoomControl } from "@peripleo/peripleo"
import { AuthorSelect, ITSBStore, ItinerariesLayer, IntersectionsLayer, MonthRangeInput } from "./components"

const fetchData = url => fetch(url).then(res => res.json());

export function App() {

  const [ authors, setAuthors ] = useState();
  
  const [ places, setPlaces ] = useState();

  const [ itineraries, setItineraries ] = useState();

  useEffect(() => {
    Promise.all([
      fetchData('../data/authors.json'),
      fetchData('../data/places.json'),
      fetchData('../data/itineraries.json')
    ]).then(([ authors, places, itineraries ]) => {
      setAuthors(authors);
      setPlaces(places);
      setItineraries(itineraries);
    });
  }, []);

  const loaded = authors && places && itineraries;

  return (
    <Peripleo>
      {loaded &&
        <ITSBStore
          authors={authors.itemListElement}
          places={places.features}
          itineraries={itineraries.first.items}>

          <aside>
            <MonthRangeInput />
            <AuthorSelect />
          </aside>

          <main>
            <Map.MapLibreDeckGL
              mapStyle="https://api.maptiler.com/maps/voyager/style.json?key=cqqmcLw28krG9Fl7V3kg"
              defaultBounds={[[-15.764914, 33.847608], [35.240991, 58.156214]]}
              layers={[ ItinerariesLayer, IntersectionsLayer ]} />

            <Controls>
              <ZoomControl />
            </Controls>
          </main>

        </ITSBStore>
      }
    </Peripleo>
  )

}