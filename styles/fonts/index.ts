import { Cinzel } from "next/font/google";
import localFont from "next/font/local";

export const futuraPtFont = localFont({
  src: [
    { path: "./futura-pt-300.woff2", weight: "300" },
    { path: "./futura-pt-400.woff2", weight: "400" },
    { path: "./futura-pt-500.woff2", weight: "500" },
    { path: "./futura-pt-600.woff2", weight: "600" },
    { path: "./futura-pt-700.woff2", weight: "700" },
  ],
  display: "block",
  variable: "--font-futura-pt",
});

export const idealWineIconsFont = localFont({ src: "./Glyphter2.woff2", display: "block" });

export const cinzelFont = Cinzel({ weight: ["400", "600"], subsets: ["latin"], display: "block" });
