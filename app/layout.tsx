import "@/styles/global.css"
import type { Metadata } from "next";
import { Toaster } from "sonner";
import SessionWrapper from "@/components/SessionWrapper/SessionWrapper";
import { UserProvider } from "@/hooks/useUser";
import { ModalProvider } from "@/components/Modal/ModalContext";

export const metadata: Metadata = {
  title: "Velo",
  description: "Stay in control of your social media. View posts, manage approvals, and access files — all from one streamlined dashboard.",
  keywords: [
    "SMMA client dashboard",
    "social media management",
    "content calendar",
    "post scheduling",
    "Google Drive integration",
    "editor task tracking",
    "client content portal",
    "social media agency software"
  ],
  openGraph: {
    title: "Velo",
    description: "Easily track posts, review content, and collaborate with your social media team — all in one place.",
    url: "https://veloapp.online",
    siteName: "Velo",
    images: [
      {
        url: "https://veloapp.online/logo/logo.png", // Replace with actual image
        width: 1200,
        height: 630,
        alt: "SMMA Client Dashboard Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velo",
    description: "Your all-in-one portal for staying updated and managing social content.",
    images: ["https://veloapp.online/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <UserProvider>
        <ModalProvider>
          <html lang="en">
            <head>
              <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
              <link rel="manifest" href="/manifest.json" />
              <link rel="apple-touch-icon" href="/favicon.ico" />
            </head>
            <body>
              <Toaster richColors position="top-center" />
              {children}
            </body>
          </html>
        </ModalProvider>
      </UserProvider>
    </SessionWrapper>
  );
}
