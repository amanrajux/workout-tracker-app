import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return <Component {...pageProps} />;
}
