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
        primaryColor: "rgba(211, 211, 255, 0.82)",
        secondaryColor: "750C75",
        bgCtn: "rgba(38, 0, 38, 0.62)",
        bgContact: "rgba(38, 11, 38, 1)",
        btnHero:"rgba(117, 12, 117, 1)",
        btnSignIn:"rgba(117, 12, 117, 1)",
        bgSidebar:"rgba(211, 211, 255, 1)",
        bgBtnPurple:"rgba(191, 168, 255, 1)"
      },
      textColor:{
        textColorPurple:"rgba(96, 79, 144, 1)"

      }
    },
  },
  plugins: [],
};
