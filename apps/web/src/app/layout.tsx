import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QGift — send a gift on Celo",
  description:
    "QGift is a MiniPay mini app for sending cUSD gifts. Wrap a real moment in an occasion, a message, and an amount. Send in 60 seconds.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1414",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="talentapp:project_verification"
          content="438ea8fcb993dcf93f0ad7f510d290ec72608b73c50b657430d6b2ea0cc97927fce82a9c4ef7382a8e87fc64bd3371e33e5b4a000cdd71ad6087a15f180ff1f7"
        />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=boska@500,600&f[]=switzer@400,500,600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
