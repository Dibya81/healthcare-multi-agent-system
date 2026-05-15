import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura Health — Your Personal AI Health OS",
  description:
    "Aura is your futuristic AI-powered personal health companion. Real-time body insights, wellness tracking, and proactive AI care — all in one place.",
};

import QueryProvider from "@/context/QueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
