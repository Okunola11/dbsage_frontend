import { Poppins, Redressed, Lora, Inter } from "next/font/google";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
  style: ["normal"],
});

const redressed = Redressed({
  subsets: ["latin"],
  weight: ["400"],
  preload: true,
});

const lora = Lora({
  weight: ["700", "600", "500"],
  subsets: ["cyrillic"],
  style: ["normal"],
});

const inter = Inter({
  subsets: ["latin"],
  style: ["normal"],
});

export { poppins, redressed, lora, inter, geistMono, geistSans };
