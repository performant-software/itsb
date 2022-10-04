import { timespanInRange } from "./Date";

export const filterTrajectories = ({ trajectories, authors, dateRange }) => {
    const authorTrajectories = {};
    // construct object with trajectories keyed on author
    if (trajectories?.first?.items?.length) {
        trajectories.first.items.forEach((linkedTrace) => {
            const key = linkedTrace.target[0].id;
            // set author's trajectories to those within date range
            if (authors?.includes(key)) {
                authorTrajectories[key] = linkedTrace.body.value.filter(
                    (stop) => {
                        return stop.when.timespans
                            .map((timespan) =>
                                timespanInRange({ timespan, dateRange }),
                            )
                            .every(Boolean); // i.e. all evaluate to true
                    },
                );
            }
        });
    }
    return authorTrajectories;
};

export const getTrajectoryCoords = ({ trajectories, places }) => {
    const trajectoryCoords = {};
    Object.entries(trajectories).forEach(([key, value]) => {
        trajectoryCoords[key] = value.map((stop, idx, ary) => {
            if (idx !== 0) {
                const fromPlace = places.features.find(
                    (place) => place["@id"] === ary[idx - 1]["id"],
                );
                const toPlace = places.features.find(
                    (place) => place["@id"] === stop["id"],
                );
                if (fromPlace && toPlace) {
                    return {
                        from: fromPlace.geometry,
                        to: toPlace.geometry,
                    };
                }
            }
        });
        trajectoryCoords[key].shift();
    });
    return trajectoryCoords;
};
