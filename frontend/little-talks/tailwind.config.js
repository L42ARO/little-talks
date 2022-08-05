/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'ion-dark':'#121212'
      },
      screens: {
        "2xl-a": { 'raw': '(max-height: 1536px),(max-width: 1536px)' },
        'xl-a': { 'raw': '(max-height: 1280px),(max-width: 1280px)' },
        'lg-a': { 'raw': '(max-height: 1024px),(max-width: 1024px)' },
        'md-a': { 'raw': '(max-height: 768px),(max-width: 768px)' },
        'sm-w':{ 'raw': '(max-width: 640px)' },
        'sm-h':{'raw':'(max-height:400px)'},
        'sm-a': { 'raw': '(max-height: 640px),(max-width: 640px)' },
        'xs-w':{ 'raw': '(max-width: 320px)' },
        'xs-a': { 'raw': '(max-height: 320px),(max-width: 320px)' },

      },
    },
  },
  plugins: [],
}
