import "@/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import 'antd/dist/reset.css';
import MainLayout from "@/pages/MainLayout";
import { ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider theme={theme}>
      <MainLayout>
        <Component {...pageProps} />
        <Analytics />
        <SpeedInsights />
      </MainLayout>
    </ConfigProvider>
  );
}
