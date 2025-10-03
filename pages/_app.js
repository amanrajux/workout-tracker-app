import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <style jsx global>{`
        body {
          font-family: "Inter", sans-serif;
          margin: 0;
          padding: 0;
          background-color: #013220; /* Deep sea green dark background */
          color: #e0f2f1;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
