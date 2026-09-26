import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "xvendor // Private Vendor Verification | Midnight Network",
  description: "New ways to verify vendors. Privacy-preserving zero-knowledge supplier due diligence, compliance scoring, and accreditation protocol on Midnight Network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className={plusJakarta.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
