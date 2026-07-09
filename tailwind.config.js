/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				retro: {
					primary: '#e50006',
					secondary: 'oklch(54% 0.245 262.881)',
					accent: 'oklch(60% 0.126 221.723)',
					neutral: 'oklch(37% 0 0)',
					'base-100': 'oklch(14% 0 0)',
					'base-200': 'oklch(20% 0 0)',
					'base-300': 'oklch(26% 0 0)',
					info: 'oklch(62% 0.214 259.815)',
					success: 'oklch(69% 0.17 162.48)',
					warning: 'oklch(76% 0.188 70.08)',
					error: 'oklch(63% 0.237 25.331)'
				}
			}
		]
	}
};
