import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skill Swap",
  description: "A platform for skill exchange",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.className} min-h-screen bg-gray-950 text-gray-100 antialiased`}
      >
        <div className="relative min-h-screen flex flex-col">
          {/* Fixed Background Effects */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(120,119,198,0.1),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_600px,rgba(165,119,198,0.1),transparent)]" />
          </div>

          {/* Content */}
          <Navbar />
          <main className="flex-1 relative">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
