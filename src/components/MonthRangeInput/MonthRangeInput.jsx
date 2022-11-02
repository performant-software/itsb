import { useEffect, useState } from 'react';
import {
  addMonths,
  endOfMonth,
  endOfToday,
  format,
  isBefore,
  isMatch,
  startOfMonth,
} from 'date-fns';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useSearch } from '@peripleo/peripleo';
import './MonthRangeInput.css';

// Shorthand
const fmtString = 'yyyy-MM';
const fmt = (date) => format(date, fmtString);
const monthStart = (formattedDate) => startOfMonth(new Date(`${formattedDate}-02T00:00:00`));
const monthEnd = (formattedDate) => endOfMonth(new Date(`${formattedDate}-02T00:00:00`));
const isValid = (date) => date.length === fmtString.length && isMatch(date, fmtString);
const isRangeValid = (from, to) => isBefore(monthStart(from), monthEnd(to));

// TODO lookup min date from graph!
const minDate = fmt(new Date(1850, 0, 1));
const maxDate = fmt(endOfToday());

export const MonthRangeInput = () => {
  const { search, setFilter } = useSearch();
  const filterState = search.args.filters?.find((f) => f.name === 'daterange')?.range || [
    minDate,
    maxDate,
  ];

  // Get initial value of the input from existing filter state
  const [monthInputValue, setMonthInputValue] = useState({
    from: filterState[0],
    to: filterState[1],
  });

  /*
   * As a side effect, when monthInputValue changes, validate the input and if valid,
   * update the filter state.
   */
  useEffect(() => {
    const { from, to } = monthInputValue;
    if (from && to && isValid(from) && isValid(to) && isRangeValid(from, to)) {
      setFilter({ name: 'daterange', range: [from, to] });
    }
  }, [monthInputValue]);

  /*
   * Given a number, return a curried event handler function that will increment the
   * targeted date by that number.
   */
  const increment = (inc) => (evt) => {
    const { name } = evt.currentTarget;
    // use target name to determine whether to increment start or end date
    if (name.startsWith('start')) {
      setMonthInputValue((prevState) => {
        const newFrom = addMonths(monthStart(prevState.from), inc);
        return {
          from: fmt(newFrom),
          to: prevState.to,
        };
      });
    } else if (name.startsWith('end')) {
      setMonthInputValue((prevState) => {
        const newTo = addMonths(monthEnd(prevState.to), inc);
        return {
          from: prevState.from,
          to: fmt(newTo),
        };
      });
    }
  };

  const onKeyDown = (evt) => {
    if (evt.currentTarget.type === 'text') {
      if (evt.key === 'ArrowUp') {
        increment(1)(evt);
      } else if (evt.key === 'ArrowDown') {
        increment(-1)(evt);
      }
    }
  };

  const onChangeDate = (evt) => {
    const { name, value } = evt.target;
    if (name === 'start-date') {
      setMonthInputValue((prevState) => ({
        from: value,
        to: prevState.to,
      }));
    } else if (name === 'end-date') {
      setMonthInputValue((prevState) => ({
        from: prevState.from,
        to: value,
      }));
    }
  };

  return (
    <fieldset id="month-range-input">
      <div>
        <div className="button-container">
          <button
            className="up"
            disabled={!isValid(monthInputValue.from)}
            name="start-up"
            onClick={increment(1)}
          >
            <FaChevronUp />
          </button>

          <button
            className="down"
            disabled={!isValid(monthInputValue.from)}
            name="start-down"
            onClick={increment(-1)}
          >
            <FaChevronDown />
          </button>
        </div>
        <input
          type="month"
          id="start-date"
          name="start-date"
          min={minDate}
          max={maxDate}
          value={monthInputValue.from}
          onChange={onChangeDate}
          onKeyDown={isValid(monthInputValue.from) ? onKeyDown : () => {}}
          className={isValid(monthInputValue.from) ? '' : 'invalid'}
        />
        &ndash;
        <input
          type="month"
          id="end-date"
          name="end-date"
          min={minDate}
          max={maxDate}
          value={monthInputValue.to}
          onChange={onChangeDate}
          onKeyDown={isValid(monthInputValue.to) ? onKeyDown : () => {}}
          className={isValid(monthInputValue.to) ? '' : 'invalid'}
        />
        <div className="button-container">
          <button
            className="up"
            disabled={!isValid(monthInputValue.to)}
            name="end-up"
            onClick={increment(1)}
          >
            <FaChevronUp />
          </button>

          <button
            className="down"
            disabled={!isValid(monthInputValue.to)}
            name="end-down"
            onClick={increment(-1)}
          >
            <FaChevronDown />
          </button>
        </div>
      </div>
      <div>
        {(!isValid(monthInputValue.from) || !isValid(monthInputValue.to)) && (
          <span className="error">Dates must be in the format YYYY-MM.</span>
        )}
        {!isRangeValid(monthInputValue.from, monthInputValue.to) && (
          <span className="error">Start date must be before or equal to end date.</span>
        )}
      </div>
    </fieldset>
  );
};
