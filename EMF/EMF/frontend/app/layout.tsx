import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMF Fitness — Personal Training at Home & Online Coaching",
  description:
    "Transform your body without leaving home. EMF Fitness offers elite personal training, customised nutrition plans, and online coaching. Book your free session today.",
  keywords:
    "personal trainer, home training, online coaching, fat loss, EMF Fitness, fitness, workout, nutrition plan",
  openGraph: {
    title: "EMF Fitness — Personal Training at Home & Online Coaching",
    description:
      "Transform your body without leaving home. Book your free trial session with EMF Fitness.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMF Fitness",
    description: "Elite personal training — at home and online.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#e8450a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
