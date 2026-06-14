export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': '#FEF6F0',
        'bg-card': '#FFFAF7',
        'rose-soft': '#FFB1B1',
        'rose-deep': '#E8748A',
        'text-dark': '#3D2C34',
        'text-muted': '#9B7B87',
      },
      fontFamily: {
        script: ['Dancing Script', 'cursive'],
        ui: ['Quicksand', 'sans-serif'],
        display: ['Fredoka One', 'cursive'],
        hand: ['Caveat', 'cursive'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
};
