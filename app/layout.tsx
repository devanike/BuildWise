import type { Metadata } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BuildWise AI | Plan your backend with confidence",
    template: "%s | BuildWise AI",
  },
  description:
    "BuildWise AI is a backend mentor for beginner developers. Turn your project idea into a structured backend plan and understand the reasoning behind every recommendation.",
  openGraph: {
    title: "BuildWise AI | Plan your backend with confidence",
    description:
      "Turn your project idea into a structured backend plan, and understand the reasoning behind every recommendation.",
    siteName: "BuildWise AI",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildWise AI | Plan your backend with confidence",
    description:
      "Turn your project idea into a structured backend plan, and understand the reasoning behind every recommendation.",
  },
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("buildwise-theme");var r=document.documentElement;r.classList.remove("light","neutral");if(t==="light"||t==="neutral")r.classList.add(t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&f[]=cabinet-grotesk@500,700,800&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only rounded-button bg-accent px-4 py-2 text-body-sm font-medium text-accent-foreground focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
