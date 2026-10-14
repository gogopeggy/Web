import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Reveals an element once it scrolls into view.
 *
 * Returns [ref, visible, reducedMotion]. Falls back to visible immediately
 * when the viewer prefers reduced motion, or when IntersectionObserver is
 * unavailable (jsdom), so content is never hidden by a missing API.
 */
export function useReveal({ threshold = 0.15, rootMargin = '0px 0px -40px 0px' } = {}) {
	const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (reducedMotion || typeof IntersectionObserver === 'undefined') {
			setVisible(true);
			return undefined;
		}
		const node = ref.current;
		if (!node) return undefined;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setVisible(true);
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold, rootMargin }
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [reducedMotion, threshold, rootMargin]);

	return [ref, visible, reducedMotion];
}

/** Fades and lifts its children into place the first time they are scrolled to. */
export default function Reveal({ children, delay = 0, sx, ...rest }) {
	const [ref, visible, reducedMotion] = useReveal();

	return (
		<Box
			ref={ref}
			sx={{
				opacity: visible ? 1 : 0,
				transform: visible ? 'none' : 'translateY(16px)',
				transition: reducedMotion
					? 'none'
					: 'opacity .42s ease-out, transform .42s cubic-bezier(.22,.7,.2,1)',
				transitionDelay: reducedMotion ? '0ms' : `${delay}ms`,
				...sx,
			}}
			{...rest}
		>
			{children}
		</Box>
	);
}
