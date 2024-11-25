import MainLayout from "@/pages/MainLayout";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { AppProps } from "next/app";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </MainLayout>
  );
}
