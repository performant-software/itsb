import { addMonths } from "date-fns";

export const timespanInRange = ({ timespan, dateRange }) => {
    // check if a timespan (object with {start} or {end})
    // is in a date range (array of Dates of length 2)
    const [startDate, endDate] = dateRange;
    if (timespan.start) {
        const date = new Date(timespan.start.earliest || timespan.start.in);
        return date >= startDate && date <= endDate;
    } else {
        const date = new Date(timespan.end.latest || timespan.end.in);
        return date >= startDate && date <= endDate;
    }
};

export const changeDate = ({ dateRange, name, newDate }) => {
    // change start or end date, depending on which input was changed
    let [lowerDate, upperDate] = dateRange;
    if (name === "start-date") {
        lowerDate = new Date(`${newDate}-01T00:00:00`);
    } else {
        upperDate = new Date(`${newDate}-01T00:00:00`);
    }
    return [lowerDate, upperDate];
};

export const addOrSubtractMonths = ({ dateRange, name }) => {
    // add or subtract one month from start or end date,
    // depending on which input was clicked
    let [lowerDate, upperDate] = dateRange;
    let monthsToAdd = name.endsWith("-down") ? -1 : 1;
    if (name.startsWith("start-")) {
        lowerDate = addMonths(lowerDate, monthsToAdd);
    } else {
        upperDate = addMonths(upperDate, monthsToAdd);
    }
    return [lowerDate, upperDate];
};
