import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "CharlesGPT",
  description: "AI Full Stack Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AppContextProvider>
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: 'Georgia, serif', fontWeight: 800 }}>
        {children}
      </body>
    </html>
    </AppContextProvider>
    </ClerkProvider>
  );
}