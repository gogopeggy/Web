import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Datepicker from './datepicker';

test('renders calendar correctly and today is highlighted', () => {
	const today = new Date();
	render(<Datepicker anyDate={today} />);
	const calendar = screen.getByTestId('calendar');
	expect(calendar).toBeInTheDocument();

	const todayString = `${today.getDate()}日`;
	const todayElement = screen.getByText(todayString);
	expect(todayElement).toHaveClass('today');
});

test("handles date click correctly, check if it's active", () => {
	const today = new Date();
	render(<Datepicker anyDate={today} />);
	const todayString = `${today.getDate()}日`;
	const todayElement = screen.getByText(todayString);
	fireEvent.click(todayElement);
	expect(todayElement).toHaveClass('active');
});

test('sets endDate if the next click is the same or later', () => {
	const today = new Date();
	render(<Datepicker anyDate={today} />);
	const firstDay = screen.getByTestId('day-2024-07-01');
	const secondDay = screen.getByTestId('day-2024-07-02');
	fireEvent.click(firstDay);
	fireEvent.click(secondDay);
	expect(firstDay).toHaveClass('active');
	expect(secondDay).toHaveClass('active');
});

test('resets startDate if the next click is earlier than the current option', () => {
	const today = new Date();
	render(<Datepicker anyDate={today} />);
	const firstDay = screen.getByTestId('day-2024-07-02');
	const secondDay = screen.getByTestId('day-2024-07-01');
	fireEvent.click(firstDay);
	fireEvent.click(secondDay);
	expect(secondDay).toHaveClass('active');
	expect(firstDay).not.toHaveClass('active');
});

test('shows not-allowed icon when hovering on “Non-Current Month” day and disables click', () => {
	const today = new Date();
	render(<Datepicker anyDate={today} />);
	const nonCurrentMonthDay = screen.getByTestId('day-2024-06-29');
	expect(nonCurrentMonthDay).toHaveClass('non-current-month');
	fireEvent.click(nonCurrentMonthDay);
	expect(nonCurrentMonthDay).not.toHaveClass('active');
});
