import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "TARE",
  description: "Private coffee tastings with TARE founder Chris Jereza, hosted at his home in Long Island City, New York. Rare coffees. A small table. Ninety minutes.",
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
