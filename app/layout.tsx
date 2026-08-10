import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://function-finder.app";
const siteName = "Function Finder";
const description =
  "Discover music venues and DJs near you with Function Finder's interactive map. Find where to play, party, or book your next event.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Discover Music Venues & DJs`,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    "music venues",
    "DJ finder",
    "find DJs near me",
    "event venues",
    "nightlife map",
    "book a DJ",
    "venue discovery",
    "events in manila near me",
    "manila events",
  ],
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} | Discover Music Venues & DJs`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Discover Music Venues & DJs`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster richColors position="bottom-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
