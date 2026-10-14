import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Reveal, { useReveal } from '../../components/Reveal';
import ExperienceCard from './ExperienceCard';
import { ACCENT } from './accent';
import { RAIL_LEFT, RAIL_WIDTH, TIMELINE_PAD } from './timeline';
import useCv from './useCv';
import bundledCvPdf from '../../assets/Peggy-Wu-CV.pdf';

function SectionHeading({ children, note }) {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1.25,
				mt: 3.75,
				mb: 1.5,
				fontSize: 13,
				fontWeight: 700,
				color: 'text.secondary',
				letterSpacing: '0.02em',
				'&::after': { content: '""', flex: 1, height: '1px', bgcolor: 'divider' },
			}}
		>
			{children}
			{note ? (
				<Box component='span' sx={{ fontWeight: 500, color: '#94a3b8', fontSize: 12 }}>
					{note}
				</Box>
			) : null}
		</Box>
	);
}

function Chip({ label }) {
	return (
		<Box
			component='span'
			sx={{
				fontSize: 12.5,
				fontWeight: 500,
				borderRadius: '16px',
				px: 1.375,
				py: '3px',
				lineHeight: 1.6,
				border: '1px solid',
				color: 'text.primary',
				bgcolor: 'background.paper',
				borderColor: 'divider',
				transition: 'background-color .15s ease, border-color .15s ease',
				'&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' },
			}}
		>
			{label}
		</Box>
	);
}

/** Label on the left, free content on the right; stacks on mobile. */
function DefinitionRow({ label, children, last }) {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', sm: 'row' },
				gap: { xs: 0.875, sm: 1.75 },
				py: 1.5,
				borderBottom: last ? 'none' : '1px solid',
				borderColor: 'divider',
			}}
		>
			{label ? (
				<Box
					sx={{
						flex: 'none',
						width: { xs: 'auto', sm: 112 },
						fontSize: 12.5,
						fontWeight: 600,
						color: 'text.secondary',
						pt: { xs: 0, sm: 0.5 },
					}}
				>
					{label}
				</Box>
			) : null}
			<Box sx={{ minWidth: 0 }}>{children}</Box>
		</Box>
	);
}

function TimelineRail() {
	const [ref, visible, reducedMotion] = useReveal({ threshold: 0.05 });

	return (
		<Box ref={ref} sx={{ position: 'absolute', left: `${RAIL_LEFT}px`, top: 6, bottom: 6 }}>
			<Box
				sx={{
					width: `${RAIL_WIDTH}px`,
					height: '100%',
					background: 'linear-gradient(to bottom, #cbd5e1, #e2e8f0)',
					transformOrigin: 'top',
					transform: visible ? 'scaleY(1)' : 'scaleY(0)',
					transition: reducedMotion ? 'none' : 'transform .9s cubic-bezier(.22,.7,.2,1)',
				}}
			/>
		</Box>
	);
}

export default function Home() {
	const cv = useCv();
	const { profile, experience, skills, education, certifications, languages } = cv;
	// The remote document may point at the R2 copy; otherwise serve the one
	// compiled into the bundle.
	const pdfHref = cv.pdfUrl || bundledCvPdf;

	return (
		<Box sx={{ pb: 6 }}>
			<Reveal>
				<Card sx={{ mt: 1.75, px: { xs: 2, sm: 2.75 }, py: { xs: 2.25, sm: 2.75 } }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
						<Avatar
							src={profile.photo}
							alt={profile.name}
							sx={{
								width: 64,
								height: 64,
								fontSize: 24,
								fontWeight: 700,
								background: 'linear-gradient(140deg, #334155, #0f172a)',
								boxShadow: '0 2px 8px rgba(15,23,42,.18)',
							}}
						>
							{/* MUI falls back to these children if the image fails
							    to load, so the monogram stays as a safety net. */}
							{profile.initial}
						</Avatar>
						<Box>
							<Typography
								variant='h1'
								sx={{ fontSize: { xs: 21, sm: 24 }, fontWeight: 700 }}
							>
								{profile.name}
								<Box
									component='span'
									sx={{
										fontSize: 16,
										fontWeight: 600,
										color: 'text.secondary',
										letterSpacing: 0,
										display: { xs: 'block', sm: 'inline' },
										ml: { xs: 0, sm: 1 },
										mt: { xs: '2px', sm: 0 },
									}}
								>
									{profile.nameEn}
								</Box>
							</Typography>
							<Typography
								sx={{
									mt: '3px',
									fontSize: 13.5,
									fontWeight: 600,
									color: ACCENT,
								}}
							>
								{profile.title}
							</Typography>
						</Box>
					</Box>

					<Typography
						sx={{
							mt: 2,
							fontSize: 13.5,
							lineHeight: 1.85,
							color: '#475569',
							textAlign: 'justify',
						}}
					>
						{profile.summary}
					</Typography>

					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2.25 }}>
						<Button
							variant='contained'
							color='primary'
							href={pdfHref}
							download='Peggy-Wu-CV.pdf'
							startIcon={<DownloadIcon />}
							sx={{ fontSize: 13 }}
						>
							下載履歷 PDF
						</Button>
						<Button
							variant='outlined'
							href={`mailto:${profile.email}`}
							startIcon={<MailOutlineIcon />}
							sx={{
								fontSize: 13,
								color: 'text.primary',
								borderColor: 'divider',
								'&:hover': { borderColor: '#cbd5e1', bgcolor: '#f1f5f9' },
							}}
						>
							{profile.email}
						</Button>
					</Box>
				</Card>
			</Reveal>

			<SectionHeading note={`${experience.length} 段經歷`}>工作經驗</SectionHeading>
			<Box
				sx={{
					position: 'relative',
					pl: { xs: `${TIMELINE_PAD.xs}px`, sm: `${TIMELINE_PAD.sm}px` },
				}}
			>
				<TimelineRail />
				{experience.map((entry, i) => (
					<ExperienceCard
						key={`${entry.company}-${entry.period}`}
						entry={entry}
						defaultOpen={i === 0}
						delay={(i % 4) * 60}
					/>
				))}
			</Box>

			<SectionHeading>專業技能</SectionHeading>
			<Reveal>
				<Card sx={{ px: 2.25, pt: 0.75, pb: 1.75 }}>
					{skills.map((group, i) => (
						<DefinitionRow
							key={group.label}
							label={group.label}
							last={i === skills.length - 1}
						>
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
								{group.items.map((item) => (
									<Chip key={item} label={item} />
								))}
							</Box>
						</DefinitionRow>
					))}
				</Card>
			</Reveal>

			<SectionHeading>學歷</SectionHeading>
			<Reveal>
				<Card sx={{ px: 2.25, py: 0.5 }}>
					{education.map((item, i) => (
						<DefinitionRow
							key={item.school}
							label={item.period}
							last={i === education.length - 1}
						>
							<Typography sx={{ fontSize: 14, fontWeight: 600 }}>
								{item.school}
								{item.schoolEn ? (
									<Box
										component='span'
										sx={{
											fontWeight: 500,
											color: 'text.secondary',
											fontSize: 12.5,
										}}
									>
										{' '}
										{item.schoolEn}
									</Box>
								) : null}
							</Typography>
							<Typography sx={{ mt: '2px', fontSize: 12.5, color: 'text.secondary' }}>
								{item.detail}
							</Typography>
						</DefinitionRow>
					))}
				</Card>
			</Reveal>

			<Grid container spacing={1.5}>
				<Grid item xs={12} sm={6}>
					<SectionHeading>證照</SectionHeading>
					<Reveal>
						<Card sx={{ px: 2.25, py: 0.5 }}>
							{certifications.map((item, i) => (
								<DefinitionRow
									key={item.name}
									label=''
									last={i === certifications.length - 1}
								>
									<Typography sx={{ fontSize: 13, fontWeight: 600 }}>
										{item.name}
										<Box
											component='span'
											sx={{
												fontWeight: 500,
												color: 'text.secondary',
												fontSize: 12.5,
											}}
										>
											{' '}
											{item.issuer}
										</Box>
									</Typography>
								</DefinitionRow>
							))}
						</Card>
					</Reveal>
				</Grid>
				<Grid item xs={12} sm={6}>
					<SectionHeading>語言</SectionHeading>
					<Reveal>
						<Card sx={{ px: 2.25, py: 0.5 }}>
							{languages.map((item, i) => (
								<DefinitionRow
									key={item.name}
									label=''
									last={i === languages.length - 1}
								>
									<Typography sx={{ fontSize: 13, fontWeight: 600 }}>
										{item.name}
										<Box
											component='span'
											sx={{
												fontWeight: 500,
												color: 'text.secondary',
												fontSize: 12.5,
											}}
										>
											{' '}
											{item.level}
										</Box>
									</Typography>
								</DefinitionRow>
							))}
						</Card>
					</Reveal>
				</Grid>
			</Grid>
		</Box>
	);
}
