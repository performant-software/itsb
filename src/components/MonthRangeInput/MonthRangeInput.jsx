import { addMonths, endOfMonth, endOfToday, format, startOfMonth } from 'date-fns';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useSearch } from '@peripleo/peripleo';
import './MonthRangeInput.css';

// Shorthand
const fmt = (date) => format(date, 'yyyy-MM');

// TODO lookup min date from graph!
const minDate = new Date(1850, 0, 1);
const maxDate = endOfToday();

export const MonthRangeInput = () => {
  const { search, setFilter } = useSearch();

  const [from, to] = search.args.filters?.find((f) => f.name === 'daterange')?.range || [
    minDate,
    maxDate,
  ];

  const increment = (date, inc) => () => {
    const updated = date === from ? [addMonths(date, inc), to] : [from, addMonths(date, inc)];

    setFilter({ name: 'daterange', range: updated });
  };

  const onChangeDate = (date) => (evt) => {
    const { value } = evt.target;
    const updated =
      date === from
        ? [startOfMonth(new Date(`${value}-02T00:00:00`)), to]
        : [from, endOfMonth(new Date(`${value}-02T00:00:00`))];

    setFilter({ name: 'daterange', range: updated });
  };

  const onKeyDown = (date) => (evt) => {
    if (evt.currentTarget.type === 'text') {
      if (evt.key === 'ArrowUp') {
        increment(date, 1)();
      } else if (evt.key === 'ArrowDown') {
        increment(date, -1)();
      }
    }
  };

  return (
    <fieldset id="month-range-input">
      <div className="button-container">
        <button className="up" name="start-up" onClick={increment(from, +1)}>
          <FaChevronUp />
        </button>

        <button className="down" name="start-down" onClick={increment(from, -1)}>
          <FaChevronDown />
        </button>
      </div>
      <input
        type="month"
        id="start-date"
        name="start-date"
        min={fmt(minDate)}
        max={fmt(maxDate)}
        value={fmt(from)}
        onChange={onChangeDate(from)}
        onKeyDown={onKeyDown(from)}
      />
      &ndash;
      <input
        type="month"
        id="end-date"
        name="end-date"
        min={fmt(minDate)}
        max={fmt(maxDate)}
        value={fmt(to)}
        onChange={onChangeDate(to)}
        onKeyDown={onKeyDown(to)}
      />
      <div className="button-container">
        <button className="up" name="end-up" onClick={increment(to, +1)}>
          <FaChevronUp />
        </button>

        <button className="down" name="end-down" onClick={increment(to, -1)}>
          <FaChevronDown />
        </button>
      </div>
    </fieldset>
  );
};
