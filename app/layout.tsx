import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import { Ubuntu } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["700", "500", "300", "400"],
});

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/utils/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Job Finder",
  description: "Job Finder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${ubuntu.className}`}>
        <ReactQueryProvider>
          <NextTopLoader
            color="#000"
            initialPosition={0.08}
            crawlSpeed={200}
            height={4}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #000,0 0 5px #000"
          />
          <Toaster position="top-center" reverseOrder={false} />
          <MantineProvider>{children}</MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
