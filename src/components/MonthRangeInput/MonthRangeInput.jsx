import { format } from "date-fns";

export const MonthRangeInput = ({ dateRange, min, max, onChange, onClick }) => {
    const minFormatted = format(min, "yyyy-MM");
    const maxFormatted = format(max, "yyyy-MM");
    let low = minFormatted;
    let high = maxFormatted;
    try {
        low = format(dateRange[0], "yyyy-MM");
        high = format(dateRange[1], "yyyy-MM");
    } catch (e) {
        // TODO: Better validation/error handling
        console.error(e);
    }
    return (
        <fieldset style={{ textAlign: "center" }}>
            <button name="start-up" onClick={onClick}>
                Up
            </button>
            <button name="start-down" onClick={onClick}>
                Down
            </button>
            <input
                type="month"
                id="start-date"
                name="start-date"
                min={minFormatted}
                max={maxFormatted}
                value={low}
                onChange={onChange}
            ></input>
            <input
                type="month"
                id="end-date"
                name="end-date"
                min={minFormatted}
                max={maxFormatted}
                value={high}
                onChange={onChange}
            ></input>
            <button name="end-up" onClick={onClick}>
                Up
            </button>
            <button name="end-down" onClick={onClick}>
                Down
            </button>
        </fieldset>
    );
};