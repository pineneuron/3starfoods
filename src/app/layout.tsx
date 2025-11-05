import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Providers from "@/components/Providers";
import { Sora, Bebas_Neue } from "next/font/google";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });

export const metadata: Metadata = {
  title: "3 Star Foods",
  description: "Three Star Foods website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${bebas.variable}`}>
      <head>
        <link rel="icon" href="/design/src/assets/img/favi-icon.svg" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <script src="/design/src/assets/js/jquery.js" defer></script>
        <script src="/design/src/assets/js/main.js" defer></script>
      </body>
    </html>
  );
}
