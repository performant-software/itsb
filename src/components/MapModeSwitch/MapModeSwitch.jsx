export const MapModeSwitch = props => {

  return (
    <fieldset id="mode-select" style={{ marginTop: "10px" }}>
      <input
          type="radio"
          id="trajectories"
          name="trajectories"
          value="trajectories"
          checked={props.mode === "trajectories"}
          onChange={e => props.onSetMode(e.currentTarget.value)}
      ></input>
      <label htmlFor="trajectories">Trajectories</label>
      <input
          type="radio"
          id="intersections"
          name="intersections"
          value="intersections"
          checked={props.mode === "intersections"}
          onChange={e => props.onSetMode(e.currentTarget.value)}
      ></input>
      <label htmlFor="intersections">Intersections</label>
  </fieldset>
  )

}