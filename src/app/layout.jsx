export const metadata = {
  title: "DJ Blogs",
  // icons: {
  //   icon: '/logo.svg',
  // },
};

import "./globals.css";
import { Inter, Roboto, Poppins, Open_Sans, Lato, Montserrat, Nunito, DM_Sans, Merriweather, Playfair_Display } from "next/font/google";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "700"] });
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto", weight: ["400", "700"] });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "700"] });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], variable: "--font-lato", weight: ["400", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["400", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", weight: ["400", "700"] });
const merriweather = Merriweather({ subsets: ["latin"], variable: "--font-Merriweather", weight: ["400", "700"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "700"] });

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} ${poppins.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${nunito.variable} ${dmSans.variable} ${merriweather.variable} ${playfair.variable}`}
    >
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
