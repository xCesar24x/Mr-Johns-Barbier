import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Mr. John's Gentlemen's Barbería | El Arte de la Barbería Clásica",
  description: "Barbería de clase mundial en San Ramón, Costa Rica. Tradición y exclusividad desde 1995. Reserva tu experiencia Gentlemen's.",
  keywords: "Mejor barbería en San Ramón, Barbería clásica Costa Rica, Mr John's, barbería San Ramón Alajuela",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${montserrat.variable} dark`}>
      <body className="bg-charcoal text-parchment font-sans antialiased noise relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
