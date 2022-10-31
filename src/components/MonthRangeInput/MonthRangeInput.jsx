import { useState } from 'react';
import { addMonths, endOfMonth, endOfToday, format, isMatch, startOfMonth } from 'date-fns';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useSearch } from '@peripleo/peripleo';
import './MonthRangeInput.css';

// Shorthand
const fmtString = 'yyyy-MM';
const fmt = (date) => format(date, fmtString);
const isValid = (date) => date.length === fmtString.length && isMatch(date, fmtString);
const monthStart = (formattedDate) => startOfMonth(new Date(`${formattedDate}-02T00:00:00`));
const monthEnd = (formattedDate) => endOfMonth(new Date(`${formattedDate}-02T00:00:00`));

// TODO lookup min date from graph!
const minDate = new Date(1850, 0, 1);
const maxDate = endOfToday();

export const MonthRangeInput = () => {
  const { search, setFilter } = useSearch();
  const [from, to] = search.args.filters?.find((f) => f.name === 'daterange')?.range || [
    minDate,
    maxDate,
  ];

  const [monthInputValue, setMonthInputValue] = useState({
    from: fmt(from),
    to: fmt(to),
  });

  const increment = (inc) => (evt) => {
    const { name } = evt.currentTarget;
    if (name.startsWith('start')) {
      setMonthInputValue((prevState) => {
        const newFrom = addMonths(monthStart(prevState.from), inc);
        setFilter({ name: 'daterange', range: [newFrom, to] });
        return {
          from: fmt(newFrom),
          to: prevState.to,
        };
      });
    } else if (name.startsWith('end')) {
      setMonthInputValue((prevState) => {
        const newTo = addMonths(monthEnd(prevState.to), inc);
        setFilter({ name: 'daterange', range: [from, newTo] });
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
      if (isValid(value)) {
        setFilter({ name: 'daterange', range: [monthStart(value), to] });
      }
    } else if (name === 'end-date') {
      setMonthInputValue((prevState) => ({
        from: prevState.from,
        to: value,
      }));
      if (isValid(value)) {
        setFilter({ name: 'daterange', range: [from, monthEnd(value)] });
      }
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
          min={fmt(minDate)}
          max={fmt(maxDate)}
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
          min={fmt(minDate)}
          max={fmt(maxDate)}
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
      </div>
    </fieldset>
  );
};
