import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../index.css';

const Datepicker = ({ anyDate }) => {
	const currentMonth = anyDate.getMonth();
	const currentYear = anyDate.getFullYear();
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	useEffect(() => {
		generateCalendar(currentMonth, currentYear);
	}, [currentMonth, currentYear]);

	const generateCalendar = (month, year) => {
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const daysInPrevMonth = new Date(year, month, 0).getDate();

		const calendar = [];
		for (let i = firstDay; i > 0; i--) {
			calendar.push({
				date: new Date(year, month - 1, daysInPrevMonth - i + 1),
				currentMonth: false,
			});
		}

		for (let i = 1; i <= daysInMonth; i++) {
			calendar.push({
				date: new Date(year, month, i),
				currentMonth: true,
			});
		}

		const totalCells = 42;
		const cellsInMonth = firstDay + daysInMonth;
		for (let i = 1; i <= totalCells - cellsInMonth; i++) {
			calendar.push({
				date: new Date(year, month + 1, i),
				currentMonth: false,
			});
		}
		return calendar;
	};

	const handleDateClick = (date) => {
		if (!startDate || (startDate && date < startDate)) {
			setStartDate(date);
			setEndDate(null);
		} else if (date >= startDate) {
			setEndDate(date);
		}
	};

	const calendar = generateCalendar(currentMonth, currentYear);

	const isToday = (date) => {
		return (
			date.getDate() === anyDate.getDate() &&
			date.getMonth() === anyDate.getMonth() &&
			date.getFullYear() === anyDate.getFullYear()
		);
	};

	return (
		<>
			<div className='header'>
				<button className='month-button' disabled>
					&lt;
				</button>
				{currentYear}年{currentMonth + 1}月
				<button className='month-button' disabled>
					&gt;
				</button>
			</div>
			<div className='datepicker'>
				<div id='calendar' data-testid='calendar'>
					{calendar.map((day, index) => (
						<div
							key={index}
							className={`day ${!day.currentMonth ? 'non-current-month' : ''}
              ${isToday(day.date) ? 'today' : ''}
              ${startDate && day.date.toISOString() === startDate.toISOString() ? 'active' : ''}
              ${
								endDate &&
								startDate.toISOString() <= day.date.toISOString() &&
								day.date.toISOString() <= endDate.toISOString()
									? 'active'
									: ''
							}

              `}
							onClick={() => day.currentMonth && handleDateClick(day.date)}
							data-testid={`day-${day.date.toISOString().split('T')[0]}`}>
							{`${day.date.getDate()}日`}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

Datepicker.propTypes = {
	anyDate: PropTypes.instanceOf(Date),
};

export default Datepicker;
