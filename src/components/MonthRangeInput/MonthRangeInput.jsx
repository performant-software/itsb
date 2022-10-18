import { format, endOfToday, addMonths } from 'date-fns';
import { useSearch } from '@peripleo/peripleo';

// Shorthand
const fmt = date => format(date, 'yyyy-MM');

// TODO lookup min date from graph!
const minDate = new Date(1850, 0, 1);
const maxDate = endOfToday();

export const MonthRangeInput = (/*{ dateRange, min, max, onChange, onClick } */) => {

  const { search, setFilter } = useSearch();

  const [ from, to ] =
    search.args.filters?.find(f => f.name === 'daterange')?.range || [ minDate, maxDate ];

  const increment = (date, inc) => () => {
    const updated = date === from ? 
      [ addMonths(date, inc), to ] : [ from, addMonths(date, inc) ];

    setFilter({ name: 'daterange', range: updated });
  }

  const onChangeDate = date => evt => {
    const { value } = evt.target;

    const updated = date === from ?
      [ new Date(`${value}-01T00:00:00`), to ] :
      [ from, new Date(`${value}-01T00:00:00`) ];

    setFilter({ name: 'daterange', range: updated });
  }
  
  return (
    <fieldset style={{ textAlign: "center" }}>
      <button name="start-up" onClick={increment(from, +1)}>
        Up
      </button>

      <button name="start-down" onClick={increment(from, -1)}>
        Down
      </button>

      <input
        type="month"
        id="start-date"
        name="start-date"
        min={fmt(minDate)}
        max={fmt(maxDate)}
        value={fmt(from)}
        onChange={onChangeDate(from)} />

      <input
        type="month"
        id="end-date"
        name="end-date"
        min={fmt(minDate)}
        max={fmt(maxDate)}
        value={fmt(to)}
        onChange={onChangeDate(to)} />

      <button name="end-up" onClick={increment(to, +1)}>
        Up
      </button>

      <button name="end-down" onClick={increment(to, -1)}>
        Down
      </button>
    </fieldset>
  )

}