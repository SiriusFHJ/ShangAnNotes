import MainLayout from "@/pages/MainLayout";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { AppProps } from "next/app";
import Script from "next/script";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Script id="baidu-analytics" strategy="afterInteractive">{
        `var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?ef4ea6868a03afd5b45bc3ab84008217";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode?.insertBefore(hm, s);
        })();`
      }</Script>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </MainLayout>
  );
}
