import { useEffect, useState } from "react";
import Peripleo, { BrowserStore } from "@peripleo/peripleo";
import { ITSBStore, AuthorSelect, MonthRangeInput } from "./components";
// import DeckGL from "@deck.gl/react";
// import { ArcLayer, GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
// import Map from "react-map-gl";
// import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { endOfToday } from "date-fns";
import { getColor } from "./utils/Author";
import { changeDate, addOrSubtractMonths } from "./utils/Date";
import {
    getIntersections,
    getPlacesAndCounts,
    intersectionsScale,
} from "./utils/Intersections";
import { filterTrajectories, getTrajectoryCoords } from "./utils/Trajectories";
import { filterFeatures } from "./utils/Place";

import authors from '../data/authors.json';
import places from '../data/places.json';
import itineraries from '../data/itineraries.json';

export function App() {
    // set up states
    // full datasets
    const [authors, setAuthors] = useState({});
    const [places, setPlaces] = useState({});
    const [trajectories, setTrajectories] = useState({});
    // filtered/calculated data
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [trajectoriesFiltered, setTrajectoriesFiltered] = useState({});
    const [trajectoryCoords, setTrajectoryCoords] = useState({});
    const [placesFiltered, setPlacesFiltered] = useState({});
    const [intersections, setIntersections] = useState({});
    // dates
    const startDate = new Date(1850, 0, 1);
    const [dateRange, setDateRange] = useState([startDate, endOfToday()]);
    // map layers
    const [trajectoriesLayers, setTrajectoriesLayers] = useState([]);
    const [intersectionsLayers, setIntersectionsLayers] = useState([]);
    // current mode, TODO: Refactor into separate routes
    const [mode, setMode] = useState("trajectories");

    // set up effects
    // fetch places, authors, and trajectories JSON
    useEffect(() => {
        async function fetchData() {
            const placesResponse = await fetch(
                new URL("../data/places.json", import.meta.url),
            );
            const placesJson = await placesResponse.json();
            setPlaces(placesJson);
            const authorsResponse = await fetch(
                new URL("../data/authors.json", import.meta.url),
            );
            const authorsJson = await authorsResponse.json();
            setAuthors(authorsJson);
            const trajectoriesRes = await fetch(
                new URL("../data/itineraries.json", import.meta.url),
            );
            const trajectoriesJson = await trajectoriesRes.json();
            setTrajectories(trajectoriesJson);
        }
        fetchData();
    }, []);
    // filter trajectories by selected date range
    useEffect(() => {
        setTrajectoriesFiltered(
            filterTrajectories({
                trajectories,
                authors: selectedAuthors,
                dateRange,
            }),
        );
    }, [trajectories, dateRange, selectedAuthors]);
    // filter places by selected authors
    useEffect(() => {
        if (places?.features) {
            setPlacesFiltered({
                ...places,
                features: filterFeatures({
                    features: places.features,
                    trajectories: trajectoriesFiltered,
                }),
            });
        }
    }, [places, trajectoriesFiltered]);
    // calculate/filter intersections by selected authors, date range
    useEffect(() => {
        if (mode === "intersections") {
            setIntersections(
                getIntersections({
                    dateRange,
                    trajectoriesByAuthor: trajectoriesFiltered,
                }),
            );
        }
    }, [trajectoriesFiltered, dateRange, mode]);
    // find "from" and "to" geometry/coordinates for each trajectory
    useEffect(() => {
        // get source and target coords
        if (mode === "trajectories") {
            setTrajectoryCoords(
                getTrajectoryCoords({
                    trajectories: trajectoriesFiltered,
                    places: placesFiltered,
                }),
            );
        }
    }, [placesFiltered, trajectoriesFiltered, mode]);

    // effects for map layer updates
    useEffect(() => {
        if (placesFiltered) {
            /*
            const geoJsonLayer = new GeoJsonLayer({
                id: "geojson-layer",
                data: placesFiltered,
                pickable: true,
                filled: true,
                stroked: true,
                lineWidthScale: 10,
                lineWidthMinPixels: 2,
                getLineColor: [252, 176, 64, 200],
                getFillColor: [252, 176, 64, 100],
                getPointRadius: 50000,
                pointRadiusMinPixels: 6,
                getLineWidth: 10,
                pointType: "circle",
            });
            const arcLayers = selectedAuthors.map(
                (author) =>
                    new ArcLayer({
                        id: `arc-layer-${author}`,
                        data: trajectoryCoords ? trajectoryCoords[author] : {},
                        pickable: false,
                        getWidth: 1.5,
                        widthMinPixels: 1,
                        getHeight: 1,
                        getTilt: 10,
                        greatCircle: false,
                        getSourceColor: getColor({ authors, author }),
                        getTargetColor: getColor({ authors, author }),
                        getSourcePosition: (d) => {
                            if (d?.from?.coordinates)
                                return d.from.coordinates.map((coord) =>
                                    parseFloat(coord),
                                );
                        },
                        getTargetPosition: (d) => {
                            if (d?.to?.coordinates)
                                return d.to.coordinates.map((coord) =>
                                    parseFloat(coord),
                                );
                        },
                    }),
            );
            setTrajectoriesLayers([...arcLayers, geoJsonLayer]);
            */
        }
    }, [selectedAuthors, placesFiltered, trajectoryCoords]);
    useEffect(() => {
        // attach Linked Place, lists to records
        const intersectionsForViz = getPlacesAndCounts({
            intersections,
            places: placesFiltered,
        });
        /* three layers, one for each likelihood, starting with outermost (least likely)
        setIntersectionsLayers(
            [1, 2, 3].map((idx) => {
                const data = Object.values(intersectionsForViz)
                    .filter((place) => Object.keys(place.figures).length > 1)
                    .sort((place) => Object.keys(place.figures).length);
                return new ScatterplotLayer({
                    id: `scatterplot-${idx}`,
                    data,
                    pickable: true,
                    opacity: 0.8,
                    stroked: true,
                    filled: true,
                    radiusScale: 6,
                    radiusMinPixels: 4,
                    radiusMaxPixels: 2000,
                    lineWidthMinPixels: 1,
                    getPosition: (d) => d?.geometry?.coordinates,
                    getRadius: (d) => {
                        // center circle = likelihood of 3
                        let count = d.lists[3];
                        if (idx < 3) {
                            // middle circle += likelihood of 2
                            count += d.lists[2];
                        }
                        if (idx === 1) {
                            // outermost circle += likelihood of 1
                            count += d.lists[1];
                        }
                        let radius = 1000;
                        return intersectionsScale(count) * radius;
                    },
                    getFillColor: (d) => {
                        // lower opacity for lower likelihood
                        let opacity = 255;
                        if (idx == 2) {
                            opacity = 0.5 * 255;
                        } else if (idx == 1) {
                            opacity = 0.25 * 255;
                        }
                        return [252, 176, 64, opacity];
                    },
                    getLineColor: (d) => [200, 100, 0, 144],
                });
            }),
        );*/
    }, [mode, intersections]);

    // Search really works in a different way than in the previous
    // Peripleo setups. This project needs a much more graph-based
    // approach then the other projets, which were records-based.
    // ("Get me all nodes connected to X that match a criterion"
    // vs. "Get me all nodes that match this criterion")
    // TODO make it possible to inject a custom search provider?

    // render
    return (
        <>
            <Peripleo>
                <ITSBStore
                    authors={authors.itemListElement}
                    places={places.features}
                    itineraries={itineraries.first.items}>
                    {/*
                    <DeckGL
                        initialViewState={{
                            latitude: 20,
                            longitude: 10,
                            zoom: 1.3,
                            pitch: 0,
                            bearing: 0,
                        }}
                        controller={true}
                        layers={
                            mode === "trajectories"
                                ? trajectoriesLayers
                                : intersectionsLayers
                        }
                        getTooltip={({ object }) => {
                            if (mode === "trajectories")
                                return object?.properties?.title;
                            else {
                                // TODO: Clicking should open this in a separate panel
                                if (object?.figures) {
                                    const people = Object.entries(object.figures)
                                        .map(([k, v]) => {
                                            const authorName =
                                                authors?.itemListElement?.find(
                                                    (a) => a["@id"] === k,
                                                )?.name || "[?]";
                                            return `${authorName}: ${v}`;
                                            // right now this is just showing likelihoods, for debugging
                                        })
                                        .join("\n");
                                    return `${object.properties?.title}\n\n${people}`;
                                }
                            }
                        }}
                        height="calc(100vh - 50px)"
                        width="75%"
                        style={{ marginLeft: "25%", marginTop: "50px" }}
                    >
                        <Map
                            mapLib={maplibregl}
                            mapStyle="https://api.maptiler.com/maps/outdoor/style.json?key=cqqmcLw28krG9Fl7V3kg"
                        />
                    </DeckGL>
                    */}
                </ITSBStore>
            </Peripleo>

            <MonthRangeInput
                dateRange={dateRange}
                min={startDate}
                max={endOfToday()}
                onChange={(evt) =>
                    setDateRange(
                        changeDate({
                            dateRange,
                            name: evt.target.name,
                            newDate: evt.target.value,
                        }),
                    )
                }
                onClick={(evt) =>
                    setDateRange(
                        addOrSubtractMonths({
                            dateRange,
                            name: evt.target.name,
                        }),
                    )
                }
            />

            <fieldset id="mode-select" style={{ marginTop: "10px" }}>
                <input
                    type="radio"
                    id="trajectories"
                    name="trajectories"
                    value="trajectories"
                    checked={mode === "trajectories"}
                    onChange={(e) => setMode(e.currentTarget.value)}
                ></input>
                <label htmlFor="trajectories">Trajectories</label>
                <input
                    type="radio"
                    id="intersections"
                    name="intersections"
                    value="intersections"
                    checked={mode === "intersections"}
                    onChange={(e) => setMode(e.currentTarget.value)}
                ></input>
                <label htmlFor="intersections">Intersections</label>
            </fieldset>

            <AuthorSelect
                authors={authors}
                selectedAuthors={selectedAuthors}
                onChange={(author) => {
                    const idx = selectedAuthors.indexOf(author["@id"]);
                    if (idx !== -1) {
                        setSelectedAuthors((prevSelectedAuthors) => [
                            ...prevSelectedAuthors.slice(0, idx),
                            ...prevSelectedAuthors.slice(idx + 1),
                        ]);
                    } else {
                        setSelectedAuthors((prevSelectedAuthors) => [
                            ...prevSelectedAuthors,
                            author["@id"],
                        ]);
                    }
                }}
            />
        </>
    );
}
