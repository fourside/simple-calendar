import { useCallback, useMemo, useState, VFC } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Calendar />
      </header>
    </div>
  );
}

export default App;

const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fir", "Sat"] as const;

const Calendar: VFC = () => {
  const [displayDate, setDisplayDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleIncrementMonth = useCallback(() => {
    setDisplayDate((prev) => {
      const next = prev.getMonth() + 1;
      const d = new Date(prev.getTime());
      d.setMonth(next);
      return d;
    })
  }, []);

  const handleDecrementMonth = useCallback(() => {
    setDisplayDate((prev) => {
      const next = prev.getMonth() - 1;
      const d = new Date(prev.getTime());
      d.setMonth(next);
      return d;
    })
  }, []);

  const handleClickDay = useCallback((index: number) => {
    setSelectedDate(() => {
      const date = new Date(displayDate.getTime());
      date.setDate(index);
      return date;
    })
  }, [displayDate]);

  const dateHeader = useMemo(() => {
    return `${displayDate.getFullYear()}/${displayDate.getMonth() + 1}`;
  }, [displayDate]);

  const monthOffset = useMemo(() => {
    const d = new Date(displayDate.getTime());
    d.setDate(1);
    return d.getDay();
  }, [displayDate]);

  const daysWithOffsets = useMemo(() => {
    const lastDay = getLastDayOfMonth(displayDate.getFullYear(), displayDate.getMonth());
    const days = Array.from({ length: lastDay }, (_, k) => k + 1);
    const offsets: undefined[] = Array.from({ length: monthOffset });
    return [...offsets, ...days];
  }, [displayDate, monthOffset]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div onClick={handleDecrementMonth} className="decrement">◀</div>
        <div>{dateHeader}</div>
        <div onClick={handleIncrementMonth} className="increment">▶</div>
      </div>

      <div className="calendar-body">
        <div className="days">
          {week.map((day) => (
            <div key={day} className="day_of_week">
              <div>{day}</div>
            </div>
          ))}
        </div>
        <div className="days">
          {daysWithOffsets.map((date, index) => (
            <div key={index}>
              {date === undefined ? (
                <div className="date offset_date" />
              ) : (
                  <div
                    className={`date ${isSameDate(date, selectedDate, displayDate) && "selected_date"}`}
                    onClick={() => handleClickDay(date)}
                  >
                  {date}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function leapYear(year: number) :boolean {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

function getLastDayOfMonth(year: number, month: number): number {
  const lastDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;
  if (month === 1 && leapYear(year)) {
    return 29;
  }
  return lastDays[month];
}

function isSameDate(date: number, selectedDate: Date | undefined, displayDate: Date): boolean {
  if (selectedDate === undefined) {
    return false;
  }
  return selectedDate.getFullYear() === displayDate.getFullYear() &&
    selectedDate.getMonth() === displayDate.getMonth() &&
    selectedDate.getDate() === date;
}
