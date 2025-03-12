/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:'class',
  mode: "jit",

  theme: {
    extend: {
      backgroundImage: {
      // 'bg_one': "url('/src/assets/vtu4_optimized.png')",
      'dark-custom-gradient': 'linear-gradient(250deg, #2b4162 -50%, #0A101D 100%)',
      'light-custom-gradient':'linear-gradient(250deg, rgba(0,163,255,0.13) -50%, rgba(0,163,255,0) 100%)',


      },
      colors: { 
        primary: "#0A101D",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
        link: "#1CCEFF"
        // link: "#0EA5E9"

      },
      fontFamily: {
        heading_one: ["Poppins", "sans-serif"],
        body_one: ["Roboto", "sans-serif"],
        heading_two: ["Montserrat", "sans-serif"],
        body_two: ["Lato", "sans-serif"],
        heading_three: ["Nunito Sans", "sans-serif"],
        body_three: ["Source Sans 3", "sans-serif"],
        heading_four: ["Roboto", "sans-serif"],
        body_four: ["Open Sans", "sans-serif"],
        
      },

      animation: {
        'pulse-1': 'pulse 1.5s ease-in-out infinite',
        'pulse-2': 'pulse 1.5s ease-in-out 0.2s infinite',
        'pulse-3': 'pulse 1.5s ease-in-out 0.4s infinite',
        'pulse-4': 'pulse 1.5s ease-in-out 0.6s infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.9)' },
        },
      },
    },
    screens: {
      xs: "490px",
      xsm: "580px",
      ss: "630px",
      sm: "768px",
      md: "1050px",
      mdm: "1150px",
      lg: "1250px",
      xl: "1700px",
    },
  },
  plugins: [],
}
 

