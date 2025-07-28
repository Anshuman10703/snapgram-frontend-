// ~/snapgram-amplify-original/frontend/postcss.config.js
// CORRECTED: Import from @tailwindcss/postcss
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: {
    tailwindcss: tailwindcss, // Use the imported plugin
    autoprefixer: autoprefixer,
  },
};