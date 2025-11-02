import type { Metadata } from "next";
import "./globals.css";
import "../../public/design/src/input.css";
import Providers from "@/components/Providers";

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
    <html lang="en">
      <head>
        <link rel="icon" href="/design/src/assets/img/favi-icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap" rel="stylesheet" />
        {/* <link href="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css" rel="stylesheet" /> */}
        <link href="/design/src/assets/css/owl.carousel.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <script src="/design/src/assets/js/jquery.js" defer></script>
        <script src="/design/src/assets/js/main.js" defer></script>
        {/* <script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js" defer></script> */}
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>
      </body>
    </html>
  );
}
