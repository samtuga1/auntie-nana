import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { cn } from "@/lib/utils";

// Self-hosted so the build never depends on reaching Google Fonts.
// Only 300/400/500 ship today — add Inter-SemiBold.ttf (600) and Inter-Bold.ttf
// (700) here when available, otherwise headings are synthesised from 500.
const inter = localFont({
  src: [
    { path: "../public/fonts/Inter-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Inter-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  title: { default: "Auntie Nana", template: "%s | Auntie Nana" },
  description:
    "Authentic Ghanaian meals and seasonings made with locally sourced ingredients. Quick to prepare, healthy to eat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", inter.variable)}>
      <body className="flex min-h-screen flex-col font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
