import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import { Abel, Inter } from 'next/font/google'
import "./globals.css";
import { Web3Provider } from "./Web3Provider";
import { ThirdwebProvider } from "thirdweb/react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Footer from "../../components/Footer";
import Header from "@/components/Header";
import { LensSessionProvider } from "@/contexts/LensSessionContext";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Lens Agora",
  description: "The Social Marketplace of Lens Chain.",
  icons: {
    icon: "/logo1.png",
    shortcut: "/logo1.png",
    apple: "/logo1.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lens Agora",
    description: "The Social Marketplace of Lens Chain.",
    images: [
      {
        url: "/logo1.png",
        alt: "Lens Agora Logo",
      },
    ],
  },
  openGraph: {
    title: "Lens Agora",
    description: "The Social Marketplace of Lens Chain.",
    url: "https://lensagora.xyz",
    siteName: "Lens Agora",
    images: [
      {
        url: "/logo1.png",
        alt: "Lens Agora Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <Web3Provider>
            <ThemeProvider>
              <LensSessionProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                </div>
              </LensSessionProvider>
            </ThemeProvider>
          </Web3Provider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
