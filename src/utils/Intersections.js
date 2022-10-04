import { scaleLinear } from "d3-scale";
import { eachMonthOfInterval, isAfter } from "date-fns";

export const intersectionsScale = scaleLinear().domain([0, 10]).range([0, 36]);

const appendMovement = ({ intersections, movement, shouldAddMovement }) => {
    // append a movement at a date to intersections object, then return modified object
    const placeID = movement.id;
    if (Object.hasOwn(intersections, placeID)) {
        // append author movement to "figures" key
        // highest likelihood score wins
        const authorInList = Object.entries(
            intersections[placeID].figures,
        ).find(([k, v]) => k === movement.author);
        if (!authorInList) {
            // author not present yet, add author with likelihood score
            intersections[placeID].figures[movement.author] = [
                movement.likelihood,
            ];
        } else if (authorInList) {
            // compare likelihood, if this movement's is higher, assign it
            const [_, likelihoods] = authorInList;
            if (!likelihoods.includes(movement.likelihood)) {
                intersections[placeID].figures[movement.author].push(
                    movement.likelihood,
                );
            }
        }
        // add movement to movements (if unique)
        if (shouldAddMovement) {
            intersections[placeID].movements.push(movement);
        }
    } else {
        intersections[placeID] = {
            figures: { [movement.author]: [movement.likelihood] },
            movements: [movement],
        };
    }
    return intersections;
};

export const getIntersections = ({ dateRange, trajectoriesByAuthor }) => {
    // get intersections with likelihood scores
    // adapted directly from elotroalex/itsb (GenerateJson.py); might need work
    if (dateRange && trajectoriesByAuthor) {
        let intersections = {};
        Object.entries(trajectoriesByAuthor).forEach(
            ([authorId, trajectory]) => {
                trajectory.forEach((movement, idx) => {
                    if (movement.when?.timespans) {
                        // Date representation:
                        // - Earliest Presence  | {start: {earliest}}
                        // - Arrival            | {start: {in}}
                        // - Departure          | {end: {in}}
                        // - Latest Presence    | {end: {latest}}

                        const timespans = movement.when.timespans;
                        // current movement has a start date and an end date: likelihood = 3
                        if (
                            ["start", "end"].every((key) =>
                                timespans.some((span) =>
                                    Object.hasOwn(span, key),
                                ),
                            )
                        ) {
                            // get in/earliest/latest for start and end
                            let start =
                                timespans[0].start || timespans[1].start;
                            start = new Date(start.in || start.earliest);
                            let end = timespans[1].end || timespans[0].end;
                            end = new Date(end.in || end.latest);
                            // ensure valid interval
                            if (!isAfter(start, end)) {
                                // add movement to each month in intersections obj
                                const m = {
                                    ...movement,
                                    author: authorId,
                                    likelihood: 3,
                                };
                                eachMonthOfInterval({ start, end }).forEach(
                                    () => {
                                        intersections = appendMovement({
                                            intersections,
                                            movement: m,
                                        });
                                    },
                                );
                            }
                        } else if (
                            // current movement has either a start date or an end date
                            timespans.length &&
                            idx > 0 &&
                            trajectory[idx - 1].when?.timespans?.length
                        ) {
                            const prev = trajectory[idx - 1];
                            const previousTimespans = prev.when.timespans;

                            // get in/earliest/latest for start and end
                            let previousWasDeparture = false;
                            let currentIsArrival = false;
                            let fromDate = null;
                            let toDate = null;

                            if (previousTimespans.some((span) => span.end)) {
                                fromDate =
                                    previousTimespans[1]?.end ||
                                    previousTimespans[0].end;
                                // in old python script: previous_movement['EndType'] == 'departure'
                                // departure: {end: {in}}
                                previousWasDeparture = Object.hasOwn(
                                    fromDate,
                                    "in",
                                );
                                fromDate = new Date(
                                    fromDate.in || fromDate.latest,
                                );
                            } else {
                                fromDate =
                                    previousTimespans[0].start ||
                                    previousTimespans[1].start;
                                fromDate = new Date(
                                    fromDate.in || fromDate.earliest,
                                );
                            }

                            if (timespans.some((span) => span.end)) {
                                toDate = timespans[1]?.end || timespans[0].end;
                                toDate = new Date(toDate.in || toDate.latest);
                            } else {
                                toDate =
                                    timespans[0].start || timespans[1].start;
                                // in old python script: current_movement['StartType'] == 'arrival'
                                // arrival: {start: {in}}
                                currentIsArrival = Object.hasOwn(toDate, "in");
                                toDate = new Date(toDate.in || toDate.earliest);
                            }

                            if (!isAfter(fromDate, toDate)) {
                                const currentMovement = {
                                    ...movement,
                                    author: authorId,
                                };
                                const previousMovement = {
                                    ...prev,
                                    author: authorId,
                                };
                                // only add each movement to the movements array for a place once
                                let addedCurrent = false;
                                let addedPrev = false;
                                // add movement to each month in intersections obj
                                eachMonthOfInterval({
                                    start: fromDate,
                                    end: toDate,
                                }).forEach(() => {
                                    if (
                                        currentIsArrival &&
                                        !previousWasDeparture
                                    ) {
                                        // likelihood = 2
                                        intersections = appendMovement({
                                            intersections,
                                            movement: {
                                                ...previousMovement,
                                                likelihood: 2,
                                            },
                                            shouldAddMovement: !addedPrev,
                                        });
                                        addedPrev = true;
                                    } else if (
                                        previousWasDeparture &&
                                        !currentIsArrival
                                    ) {
                                        // likelihood = 2
                                        intersections = appendMovement({
                                            intersections,
                                            movement: {
                                                ...currentMovement,
                                                likelihood: 2,
                                            },
                                            shouldAddMovement: !addedCurrent,
                                        });
                                        addedCurrent = true;
                                    } else if (!currentIsArrival) {
                                        // likelihood = 1
                                        intersections = appendMovement({
                                            intersections,
                                            movement: {
                                                ...currentMovement,
                                                likelihood: 1,
                                            },
                                            shouldAddMovement: !addedCurrent,
                                        });
                                        addedCurrent = true;
                                        intersections = appendMovement({
                                            intersections,
                                            movement: {
                                                ...previousMovement,
                                                likelihood: 1,
                                            },
                                            shouldAddMovement: !addedPrev,
                                        });
                                        addedPrev = true;
                                    }
                                });
                            }
                        }
                    }
                });
            },
        );
        return intersections;
    }
};

export const getPlacesAndCounts = ({ intersections, places }) => {
    // attach Linked Place, lists to records
    const withPlacesAndCounts = {};
    Object.entries(intersections).forEach(([place, val]) => {
        // attach Linked Place (including geometry) if present
        const foundPlace = places.features.find((p) => p["@id"] === place);
        withPlacesAndCounts[place] = foundPlace
            ? {
                  ...val,
                  ...foundPlace,
              }
            : val;
        // attach counts per likelihood
        withPlacesAndCounts[place].lists = {};
        for (var i = 1; i <= 3; i++) {
            withPlacesAndCounts[place].lists[i] = Object.values(
                val.figures,
            ).filter(function (likelihoods) {
                return likelihoods.includes(i);
            }).length;
        }
    });
    return withPlacesAndCounts;
};
