import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import StoreProvider from "@/components/StoreProvider";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: {
    default: "Astra – The Real Gym",
    template: "%s | Astra Gym",
  },
  description:
    "Transform your body and mind at Astra – The Real Gym. Premium fitness facility with world-class trainers, state-of-the-art equipment, and flexible membership plans.",
  keywords: [
    "gym",
    "fitness",
    "workout",
    "personal trainer",
    "Astra gym",
    "membership",
    "weight loss",
    "muscle building",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Astra",
  },
  openGraph: {
    title: "Astra – The Real Gym",
    description:
      "Transform your body and mind at Astra – The Real Gym. Premium fitness facility with world-class trainers.",
    type: "website",
    siteName: "Astra Gym",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astra – The Real Gym",
    description: "Transform your body and mind at Astra – The Real Gym.",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0B0B0B] text-white antialiased">
        <StoreProvider>
          <AuthProvider>{children}</AuthProvider>
        </StoreProvider>
        <InstallPrompt />
      </body>
    </html>
  );
}
