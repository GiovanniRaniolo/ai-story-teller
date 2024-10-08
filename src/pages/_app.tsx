import "@/styles/globals.scss";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="transition-background">
      <Component {...pageProps} />
    </div>
  );
}
