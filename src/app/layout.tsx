import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "TARE",
  description: "Small-group coffee tastings at Chris’s home in Long Island City, New York. A selection of specialty coffees, prepared and served by Chris.",
  icons: {
    icon: {
      url: '/favicon.png',
      type: 'image/png',
    },
    apple: {
      url: '/favicon.png',
      type: 'image/png',
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className="antialiased"
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
