import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useReveal } from '../../components/Reveal';
import { ACCENT, ACCENT_RING, ACCENT_SOFT } from './accent';
import { DOT_LEFT, DOT_SIZE, DOT_TOP } from './timeline';
import { resolveLogo } from './logos';

// Fixed square so logos of differing aspect ratios all reserve the same
// width, keeping every company name on the same left edge.
const LOGO_BOX = 22;

/** A bullet, optionally with a bold label and one level of nested children. */
function Bullet({ bullet, nested }) {
	return (
		<Box
			component='li'
			sx={{
				position: 'relative',
				pl: nested ? '14px' : '15px',
				mb: nested ? 0.75 : 1.125,
				'&:last-of-type': { mb: 0 },
				fontSize: nested ? 12.5 : 13,
				lineHeight: 1.8,
				color: nested ? 'text.secondary' : '#475569',
				'&::before': {
					content: '""',
					position: 'absolute',
					left: '2px',
					top: nested ? '10px' : '9px',
					width: '5px',
					height: nested ? '1.5px' : '5px',
					borderRadius: nested ? 0 : '50%',
					bgcolor: nested ? '#cbd5e1' : '#94a3b8',
				},
			}}
		>
			{bullet.label ? (
				<Box component='b' sx={{ color: 'text.primary', fontWeight: 600 }}>
					{bullet.label}
					{/* the colon introduces what follows, so a label that is
					    already a complete sentence does not get one */}
					{/[。．.：:！!？?]$/.test(bullet.label) ? '' : '：'}
				</Box>
			) : null}
			{bullet.text}
			{bullet.children ? (
				<Box component='ul' sx={{ listStyle: 'none', m: 0, mt: 0.875, p: 0 }}>
					{bullet.children.map((child, i) => (
						<Bullet key={i} bullet={child} nested />
					))}
				</Box>
			) : null}
		</Box>
	);
}

export default function ExperienceCard({ entry, defaultOpen = false, delay = 0 }) {
	const [ref, visible, reducedMotion] = useReveal();
	const [open, setOpen] = useState(defaultOpen);

	const logoSrc = resolveLogo(entry.logo);
	const expandable =
		Boolean(entry.intro) ||
		entry.bullets.some((bullet) => Boolean(bullet.children)) ||
		entry.bullets.length > 1;

	// Preferred summary is the bullet labels joined. Entries whose bullets are
	// plain sentences have no labels, so fall back to the intro or the opening
	// sentence — a collapsed card must never be blank.
	const gistParts = entry.bullets.map((bullet) => bullet.short || bullet.label).filter(Boolean);
	const gist =
		gistParts.length > 1
			? gistParts.join(' · ')
			: entry.intro || (entry.bullets[0] && entry.bullets[0].text) || '';

	const header = (
		<Box
			sx={{
				px: { xs: 1.75, sm: 2.25 },
				py: 2,
				display: 'flex',
				alignItems: 'flex-start',
				gap: 1.5,
			}}
		>
			<Box
				sx={{
					width: LOGO_BOX,
					height: LOGO_BOX,
					flex: 'none',
					mt: '1px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{logoSrc ? (
					<Box
						component='img'
						src={logoSrc}
						alt=''
						sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
					/>
				) : null}
			</Box>
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Box>
					<Typography
						component='span'
						sx={{
							fontSize: { xs: 14.5, sm: 15.5 },
							fontWeight: 700,
							letterSpacing: '-0.01em',
							display: { xs: 'block', sm: 'inline' },
						}}
					>
						{entry.company}
						{entry.companyNote ? (
							<Box
								component='span'
								sx={{ fontWeight: 500, color: 'text.secondary', fontSize: 13 }}
							>
								{' '}
								{entry.companyNote}
							</Box>
						) : null}
					</Typography>
					<Typography
						component='span'
						sx={{
							fontSize: 13,
							fontWeight: 600,
							color: ACCENT,
							display: { xs: 'block', sm: 'inline' },
							ml: { xs: 0, sm: 1.125 },
							mt: { xs: 0.25, sm: 0 },
						}}
					>
						{entry.role}
					</Typography>
				</Box>
				{expandable ? (
					<Box
						sx={{
							display: 'block',
							mt: open ? 0 : 0.75,
							fontSize: 12.5,
							lineHeight: 1.6,
							color: 'text.secondary',
							overflow: 'hidden',
							opacity: open ? 0 : 1,
							maxHeight: open ? 0 : '21px',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
							transition: reducedMotion
								? 'none'
								: 'max-height .28s ease, opacity .2s ease, margin-top .28s ease',
						}}
					>
						{gist}
					</Box>
				) : null}
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 'none' }}>
				<Box
					component='span'
					sx={{
						fontSize: 11.5,
						fontWeight: 600,
						borderRadius: '16px',
						px: 1.25,
						py: '3px',
						whiteSpace: 'nowrap',
						...(entry.current
							? ACCENT_SOFT
							: {
									color: 'text.secondary',
									bgcolor: '#f1f5f9',
									border: '1px solid',
									borderColor: 'divider',
							  }),
					}}
				>
					{entry.period}
				</Box>
				{expandable ? (
					<KeyboardArrowDownIcon
						sx={{
							fontSize: 20,
							color: '#94a3b8',
							flex: 'none',
							transform: open ? 'rotate(180deg)' : 'none',
							transition: reducedMotion ? 'none' : 'transform .2s ease',
						}}
					/>
				) : null}
			</Box>
		</Box>
	);

	// Static and expandable cards share one body block, so their padding, type
	// scale and colour cannot drift apart. It sits outside the header's flex
	// row deliberately: inside it, text would be squeezed into the column left
	// over beside the period chip instead of using the card's full width.
	const body = (
		<Box sx={{ px: { xs: 1.75, sm: 2.25 }, pb: 2.25 }}>
			{entry.intro ? (
				<Typography
					sx={{
						fontSize: 13,
						lineHeight: 1.8,
						color: '#475569',
						pt: 1.5,
						borderTop: '1px solid',
						borderColor: 'divider',
					}}
				>
					{entry.intro}
				</Typography>
			) : null}
			<Box
				component='ul'
				sx={{
					listStyle: 'none',
					m: 0,
					mt: entry.intro ? 1.25 : 0,
					p: 0,
					...(entry.intro
						? null
						: { pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }),
				}}
			>
				{entry.bullets.map((bullet, i) => (
					<Bullet key={i} bullet={bullet} />
				))}
			</Box>
		</Box>
	);

	return (
		<Box
			ref={ref}
			sx={{
				position: 'relative',
				mb: 1.5,
				opacity: visible ? 1 : 0,
				transform: visible ? 'none' : 'translateY(16px)',
				transition: reducedMotion
					? 'none'
					: 'opacity .42s ease-out, transform .42s cubic-bezier(.22,.7,.2,1)',
				transitionDelay: reducedMotion ? '0ms' : `${delay}ms`,
			}}
		>
			<Box
				component='span'
				sx={{
					position: 'absolute',
					left: DOT_LEFT,
					top: DOT_TOP,
					width: DOT_SIZE,
					height: DOT_SIZE,
					borderRadius: '50%',
					border: '2px solid',
					transform: visible ? 'scale(1)' : 'scale(0.4)',
					opacity: visible ? 1 : 0,
					transition: reducedMotion
						? 'none'
						: 'transform .45s cubic-bezier(.34,1.56,.64,1), opacity .3s ease',
					...(entry.current
						? {
								bgcolor: ACCENT,
								borderColor: ACCENT,
								boxShadow: `0 0 0 4px ${ACCENT_RING}`,
						  }
						: { bgcolor: 'background.paper', borderColor: '#cbd5e1' }),
				}}
			/>
			<Card
				sx={{
					transition: reducedMotion ? 'none' : 'box-shadow .18s ease, transform .18s ease',
					...(expandable
						? {
								'&:hover': {
									transform: 'translateY(-2px)',
									boxShadow:
										'0 10px 24px rgba(15,23,42,.1), 0 2px 6px rgba(15,23,42,.05)',
								},
						  }
						: null),
				}}
			>
				{expandable ? (
					<CardActionArea
						onClick={() => setOpen((prev) => !prev)}
						aria-expanded={open}
						sx={{ borderRadius: '12px' }}
					>
						{header}
					</CardActionArea>
				) : (
					header
				)}
				{expandable ? (
					<Collapse in={open} timeout={reducedMotion ? 0 : 340}>
						{body}
					</Collapse>
				) : (
					body
				)}
			</Card>
		</Box>
	);
}
