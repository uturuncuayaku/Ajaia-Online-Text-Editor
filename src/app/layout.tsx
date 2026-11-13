import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import SwirlBackground from "@/components/SwirlBackground";
import UserSwitcherDrawer from "@/components/UserSwitcherDrawer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ajaia Online Text Editor",
  description:
    "Lightweight collaborative document editor inspired by Google Docs and styled after Ajaia AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full`}>
      <body className="min-h-full bg-[#000000] text-[#f1f7ff] antialiased selection:bg-[#97c2f8]/30 selection:text-white flex flex-col relative overflow-x-hidden">
        <UserProvider>
          {/* Animated 60FPS fluid swirl background */}
          <SwirlBackground />

          {/* User persona drawer */}
          <UserSwitcherDrawer />

          {/* Toast notifications container */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#030919",
                color: "#f1f7ff",
                border: "1px solid rgba(151, 194, 248, 0.25)",
                fontSize: "13px",
              },
            }}
          />

          {/* Page contents */}
          <div className="relative z-10 flex-1 flex flex-col">{children}</div>
        </UserProvider>
      </body>
    </html>
  );
}
