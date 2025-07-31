import "@/styles/global.css"
import type { Metadata } from "next";
import { Toaster } from "sonner";
import SessionWrapper from "@/components/SessionWrapper/SessionWrapper";

export const metadata: Metadata = {
  title: "Velo Onboarding",
  description: "Onboard and begin your social media management journey with Velo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className="centered">
          <Toaster richColors position="top-center" />
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
