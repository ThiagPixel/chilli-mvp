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
					primary: '#c2410c',
					secondary: '#ea580c',
					accent: '#f97316',
					neutral: '#292524',
					'base-100': '#fffbf7',
					'base-200': '#f5f0eb',
					'base-300': '#e7e0d8',
					info: '#0ea5e9',
					success: '#22c55e',
					warning: '#eab308',
					error: '#ef4444'
				}
			}
		]
	}
};
