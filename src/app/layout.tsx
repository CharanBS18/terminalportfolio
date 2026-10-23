import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eDEX-UI // Charan BS | Security Terminal Portfolio",
  description: "An immersive eDEX-UI sci-fi terminal portfolio. Penetration testing, offensive security research, and interactive technical telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-mono"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#020610]">
        {children}
      </body>
    </html>
  );
}
