/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        heroImage: 'url(./assets/image.png) !important',
      },
      backgroundColor:{
        primaryColor: "D3D3FF",
        secondaryColor: "750C75",
        bgCtn: "rgba(38, 0, 38, 0.62)",
        bgContact: "rgba(38, 0, 38, 1)",
        btnHero:"rgba(117, 12, 117, 1)",
        btnSignIn:"rgba(38, 0, 38, 0.62)"
      }
    },
  },
  plugins: [],
};
