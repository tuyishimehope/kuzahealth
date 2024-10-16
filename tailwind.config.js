import { PiHourglassMedium } from 'react-icons/pi';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        heroImage: 'url(./assets/image.png) !important',
        heroVideo: "url(./assets/heroVide.mp4)" ,      },
      backgroundColor:{
        primaryColor: "D3D3FF",
        secondaryColor: "750C75",
        bgCtn: "rgba(38, 0, 38, 0.62)",
        bgContact: "rgba(38, 11, 38, 1)",
        btnHero:"rgba(117, 12, 117, 1)",
        btnSignIn:"rgba(117, 12, 117, 1)",
        bgSidebar:"rgba(211, 211, 255, 1)"
      }
    },
  },
  plugins: [],
};
