import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "react-hot-toast";
import EnergyWrapper from "@/components/EnergyWrapper";
import GlobalBackground from "@/components/GlobalBackground";

export const metadata: Metadata = {
    title: "Habit Buddy",
    description: "Daily habits with pet + streaks",
    manifest: "/manifest.json",
    icons: {
        icon: "/icons/icon-192.png",
        apple: "/icons/icon-512.png",
    },
    appleWebApp: {
        capable: true,
        title: "Habit Buddy",
        statusBarStyle: "default",
    },
};

export const viewport: Viewport = {
    themeColor: "--color-wallpaper",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={GeistSans.className}>
            <body>
                {/* <GlobalBackground /> */}
                <EnergyWrapper>
                    {children}
                </EnergyWrapper>
                <Toaster position="top-right" />
            </body>
        </html>
    );
}