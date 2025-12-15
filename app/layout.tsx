import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SplitEase - Expense Splitting Made Easy",
  description: "Track and split expenses with your flatmates effortlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
