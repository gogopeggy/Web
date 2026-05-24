import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import logo from '../../assets/brainLogo.png';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Navbar = () => {
	const location = useLocation();
	const pathName = location.pathname;
	const [bookingAnchor, setBookingAnchor] = useState(null);

	const pages = {
		Home: '/',
		Recipe: '/recipe',
		Expense: '/expense',
		Camping: '/camping',
	};
	const bookingItems = [
		{ label: '預訂', path: '/booking' },
		{ label: '管理訂位', path: '/booking/manage' },
	];
	const isBookingActive = pathName.startsWith('/booking');

	const openBooking = (e) => setBookingAnchor(e.currentTarget);
	const closeBooking = () => setBookingAnchor(null);

	return (
		<nav className='navbar'>
			<img src={logo} alt='logo' width={30} height={30} />
			<Typography fontSize={14} pl={1} fontFamily={'system-ui'}>
				Ideasss
			</Typography>
			<div className='links'>
				{Object.keys(pages).map((p) => (
					<Link
						key={p}
						to={pages[p]}
						className={pathName === pages[p] ? 'navactive' : ''}
					>
						{p}
					</Link>
				))}
				<button
					type='button'
					onClick={openBooking}
					className={`nav-dropdown-trigger ${
						isBookingActive ? 'navactive' : ''
					}`}
					aria-haspopup='menu'
					aria-expanded={Boolean(bookingAnchor)}
				>
					Booking
					<KeyboardArrowDownIcon sx={{ fontSize: 16, ml: 0.25 }} />
				</button>
				<Menu
					anchorEl={bookingAnchor}
					open={Boolean(bookingAnchor)}
					onClose={closeBooking}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				>
					{bookingItems.map((item) => (
						<MenuItem
							key={item.path}
							component={Link}
							to={item.path}
							onClick={closeBooking}
							selected={pathName === item.path}
						>
							{item.label}
						</MenuItem>
					))}
				</Menu>
			</div>
		</nav>
	);
};

export default Navbar;
