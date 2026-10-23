import type { Metadata } from "next";
import { VT323, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
});

export const metadata: Metadata = {
  title: "DEV-OS v3.1 | Terminal Portfolio",
  description: "An immersive terminal portfolio. Retro CRT monitor style, hidden hacking secrets, and mysterious filesystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${vt323.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090c05]">
        {children}
      </body>
    </html>
  );
}
