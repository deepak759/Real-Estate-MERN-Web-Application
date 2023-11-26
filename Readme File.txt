client file created using > npm create vite@latest client > react > javavscript +swc
Install Tailwind CSS

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Configure your template paths
in
tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

Add the Tailwind directives to your CSS
insd
index.css

@tailwind base;
@tailwind components;
@tailwind utilities;

Start your build process


npm run dev

10 4


todo
cookie problem
respomsiveness