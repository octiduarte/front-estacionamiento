/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fadeIn': {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' }
  			},
  			'fadeInUp': {
  				'0%': { opacity: '0', transform: 'translateY(30px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'fadeInDown': {
  				'0%': { opacity: '0', transform: 'translateY(-30px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'fadeInLeft': {
  				'0%': { opacity: '0', transform: 'translateX(-30px)' },
  				'100%': { opacity: '1', transform: 'translateX(0)' }
  			},
  			'fadeInRight': {
  				'0%': { opacity: '0', transform: 'translateX(30px)' },
  				'100%': { opacity: '1', transform: 'translateX(0)' }
  			},
  			'scaleIn': {
  				'0%': { opacity: '0', transform: 'scale(0.8)' },
  				'100%': { opacity: '1', transform: 'scale(1)' }
  			},
  			'float': {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-10px)' }
  			},
  			'carDrive': {
  				'0%': { transform: 'translateX(-100px) scale(0.8)', opacity: '0' },
  				'50%': { transform: 'translateX(0px) scale(1)', opacity: '1' },
  				'100%': { transform: 'translateX(20px) scale(1)', opacity: '1' }
  			},
  			'parkingSpot': {
  				'0%': { transform: 'scale(0.95)', backgroundColor: 'rgb(248 250 252)' },
  				'50%': { transform: 'scale(1.02)', backgroundColor: 'rgb(239 246 255)' },
  				'100%': { transform: 'scale(1)', backgroundColor: 'rgb(248 250 252)' }
  			},
  			'shimmer': {
  				'0%': { transform: 'translateX(-100%)' },
  				'100%': { transform: 'translateX(100%)' }
  			},
  			'pulse-glow': {
  				'0%, 100%': { boxShadow: '0 0 20px rgba(var(--primary), 0.3)' },
  				'50%': { boxShadow: '0 0 40px rgba(var(--primary), 0.6)' }
  			},
  			'slideInStagger': {
  				'0%': { opacity: '0', transform: 'translateY(50px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fadeIn': 'fadeIn 0.6s ease-out',
  			'fadeInUp': 'fadeInUp 0.8s ease-out',
  			'fadeInDown': 'fadeInDown 0.8s ease-out',
  			'fadeInLeft': 'fadeInLeft 0.8s ease-out',
  			'fadeInRight': 'fadeInRight 0.8s ease-out',
  			'scaleIn': 'scaleIn 0.6s ease-out',
  			'float': 'float 3s ease-in-out infinite',
  			'carDrive': 'carDrive 2s ease-out',
  			'parkingSpot': 'parkingSpot 2s ease-in-out infinite',
  			'shimmer': 'shimmer 2s linear infinite',
  			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
  			'slideInStagger': 'slideInStagger 0.8s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
