import type { Metadata } from "next";
import "./globals.css";
import { CharacterProvider } from "@/contexts/CharacterContext";

export const metadata: Metadata = {
  title: "Tolly - Create Cartoon Characters & Talking Videos",
  description: "Create fun cartoon characters from photos and make them talk with AI-powered videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CharacterProvider>
          {children}
        </CharacterProvider>
      </body>
    </html>
  );
}
