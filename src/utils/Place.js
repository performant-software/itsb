export const filterFeatures = ({ features, trajectories }) => {
    return features.filter((f) => {
        // ensure this place is in one of the selected authors' trajectories
        const placeInTrajectory = Object.values(trajectories).some(
            (trajectory) => trajectory.some((stop) => stop.id === f["@id"]),
        );
        // ensure each place has geometry
        return f.geometry?.type === "Point" && placeInTrajectory;
    });
};
