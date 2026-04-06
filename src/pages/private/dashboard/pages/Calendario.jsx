import React, { useState } from 'react';

function Calendar2() {
  const [date, setDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const monthDays = [];

  for (let i = 1; i <= daysInMonth; i++) {
    monthDays.push(<Day key={i} day={i} />);
  }

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <div>
      <div>
        <button onClick={handlePrevMonth}>Prev</button>
        <span>{`${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`}</span>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div>
        {daysOfWeek.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div>
        {monthDays}
      </div>
    </div>
  );
}

function Day({ day }) {
  const handleSelect = () => {
    console.log(`You clicked on day ${day}`);
  };

  return (
    <span onClick={handleSelect}>{day}</span>
  );
}

export default Calendar2;
