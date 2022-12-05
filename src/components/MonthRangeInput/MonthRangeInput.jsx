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
import { useInterval } from './useInterval';

const fmtString = 'yyyy-MM';
/**
 * Format a date according to the above format (YYYY-MM).
 *
 * @param {Date} date A JavaScript Date object
 * @returns {string} The formatted date
 */
const fmt = (date) => format(date, fmtString);

/**
 * Get the first day of the month for a given month.
 *
 * @param {string} formattedDate A month formatted as YYYY-MM
 * @returns {Date} The first day of the month as a JavaScript Date object
 */
const monthStart = (formattedDate) => startOfMonth(new Date(`${formattedDate}-02T00:00:00`));

/**
 * Get the last day of the month for a given month.
 *
 * @param {string} formattedDate A month formatted as YYYY-MM
 * @returns {Date} The last day of the month as a JavaScript Date object
 */
const monthEnd = (formattedDate) => endOfMonth(new Date(`${formattedDate}-02T00:00:00`));

/**
 * Check if a given string is a valid date according to the format YYYY-MM.
 *
 * @param {string} date A date formatted as a string
 * @returns {boolean} True if valid, false if invalid
 */
const isValid = (date) => date.length === fmtString.length && isMatch(date, fmtString);

/**
 * Check if a range of two dates is valid, i.e. the first month is before the second month.
 *
 * @param {Date} from The earlier date to compare
 * @param {Date} to The later date to compare
 * @returns {boolean} True if the earlier date is before the later date, false if not
 */
const isRangeValid = (from, to) => isBefore(monthStart(from), monthEnd(to));

// TODO lookup min date from graph!
const minDate = fmt(new Date(1850, 0, 1));
const maxDate = fmt(endOfToday());

/**
 * Month range input controls for filtering the map visualizations.
 *
 * @returns {React.ReactElement} Functional component for date filter controls
 */
export function MonthRangeInput() {
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

  // Initialize delay and state for incrementing/decrementing month on mousedown
  const [delay, setDelay] = useState(500);
  const [incrementState, setIncrementState] = useState(null);

  // Auto-increment the chosen date by current increment every "delay" milliseconds
  useInterval(
    () => {
      if (incrementState) {
        incrementDate(incrementState.chosenDate, incrementState.increment);
      }
    },
    incrementState ? delay : null
  );

  /**
   * "Accelerate" the input by dividing the delay once per second.
   * Adapted from Dan Abramov's code here:
   * https://overreacted.io/making-setinterval-declarative-with-react-hooks/#bonus-fun-demo
   */
  useInterval(
    () => {
      if (delay > 10 && incrementState) {
        setDelay(delay / 2);
      }
    },
    incrementState ? 1000 : null
  );

  /**
   * As a side effect, when monthInputValue changes, validate the input and if valid,
   * update the filter state.
   */
  useEffect(() => {
    const { from, to } = monthInputValue;
    if (from && to && isValid(from) && isValid(to) && isRangeValid(from, to)) {
      setFilter({ name: 'daterange', range: [from, to] });
    }
  }, [monthInputValue]);

  /**
   * Increment the start or end date, depending on which name was passed, by the passed increment.
   *
   * @param {string} name Which date to increment (start or end).
   * @param {number} inc Amount to increment by; in this case, -1 or 1.
   */
  function incrementDate(name, inc) {
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
  }

  /**
   * On mousedown targeting an increment/decrement control, perform the action once on the chosen
   * target date, then set increment state so that the auto-incrementer can read them.
   *
   * @param {number} inc Amount to increment by; in this case, -1 or 1.
   * @returns {Function} Curried event handler function that increments date and updates state.
   */
  function startIncrementing(inc) {
    return (evt) => {
      incrementDate(evt.currentTarget.name, inc);
      setIncrementState({ chosenDate: evt.currentTarget.name, increment: inc });
    };
  }

  /**
   * On mouseup targeting an increment/decrement control, set the increment state to null
   * so that the auto-incrementer will stop, and reset the delay back to its initial value (500ms).
   */
  function stopIncrementing() {
    setIncrementState(null);
    setDelay(500);
  }

  /**
   * Event handler for up and down arrow control of the month range inputs.
   *
   * @param {KeyboardEvent} evt The keyboard event.
   */
  function onKeyDown(evt) {
    if (evt.currentTarget.type === 'text') {
      if (evt.key === 'ArrowUp') {
        incrementDate(evt.currentTarget.name, 1);
      } else if (evt.key === 'ArrowDown') {
        incrementDate(evt.currentTarget.name, -1);
      }
    }
  }

  /**
   * When the date is changed in either of the date fields, update the date filter state.
   *
   * @param {ChangeEvent} evt Event triggered when the value in the field is changed.
   */
  function onChangeDate(evt) {
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
  }

  return (
    <fieldset id="month-range-input">
      <div>
        <div className="button-container">
          <button
            className="up"
            disabled={!isValid(monthInputValue.from)}
            name="start-up"
            onMouseDown={startIncrementing(1)}
            onMouseUp={stopIncrementing}
          >
            <FaChevronUp />
          </button>

          <button
            className="down"
            disabled={!isValid(monthInputValue.from)}
            name="start-down"
            onMouseDown={startIncrementing(-1)}
            onMouseUp={stopIncrementing}
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
            onMouseDown={startIncrementing(1)}
            onMouseUp={stopIncrementing}
          >
            <FaChevronUp />
          </button>

          <button
            className="down"
            disabled={!isValid(monthInputValue.to)}
            name="end-down"
            onMouseDown={startIncrementing(-1)}
            onMouseUp={stopIncrementing}
          >
            <FaChevronDown />
          </button>
        </div>
      </div>
      <div>
        {(!isValid(monthInputValue.from) || !isValid(monthInputValue.to)) && (
          <p className="error">Dates must be in the format YYYY-MM.</p>
        )}
        {!isRangeValid(monthInputValue.from, monthInputValue.to) && (
          <p className="error">Start date must be before or equal to end date.</p>
        )}
      </div>
    </fieldset>
  );
}
