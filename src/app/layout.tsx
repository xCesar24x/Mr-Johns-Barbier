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
  metadataBase: new URL("https://mrjohnsbarbier.com"),
  title: "Mr. John's Gentlemen's Barbería | El Arte de la Barbería Clásica",
  description: "Barbería de clase mundial en San Ramón, Costa Rica. Tradición y exclusividad desde 1995. Reserva tu experiencia Gentlemen's.",
  keywords: "Mejor barbería en San Ramón, Barbería clásica Costa Rica, Mr John's, barbería San Ramón Alajuela",
  icons: {
    icon: "/images/logo4k.png",
    shortcut: "/images/logo4k.png",
    apple: "/images/logo4k.png",
  },
  openGraph: {
    title: "Mr. John's Gentlemen's Barbería | El Arte de la Barbería Clásica",
    description: "Barbería de clase mundial en San Ramón, Costa Rica. Tradición y exclusividad desde 1995. Reserva tu experiencia Gentlemen's.",
    url: "https://mrjohnsbarbier.com",
    siteName: "Mr. John's Gentlemen's Barbería",
    locale: "es_CR",
    type: "website",
    images: [
      {
        url: "/images/logo4k.png",
        width: 1024,
        height: 1024,
        alt: "Mr. John's Gentlemen's Barbería",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mr. John's Gentlemen's Barbería | El Arte de la Barbería Clásica",
    description: "Barbería de clase mundial en San Ramón, Costa Rica. Tradición y exclusividad desde 1995.",
    images: ["/images/logo4k.png"],
  },
  other: {
    thumbnail: "https://mrjohnsbarbier.com/images/logo4k.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const base = '';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: "Mr. John's Gentlemen's Barbería",
    url: "https://mrjohnsbarbier.com",
    logo: "https://mrjohnsbarbier.com/images/logo4k.png",
    image: "https://mrjohnsbarbier.com/images/logo4k.png",
    description:
      "Barbería de clase mundial en San Ramón, Costa Rica. Tradición y exclusividad desde 1995.",
    telephone: "+50672429342",
    email: "mrjohnsbarbier@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Ramón",
      addressRegion: "Alajuela",
      addressCountry: "CR",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://mrjohnsbarbier.com/images/logo4k.png",
    },
  };

  return (
    <html lang="es" className={`${playfair.variable} ${montserrat.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --texture-wood: url('${base}/images/dark-wood-texture.png');
            --texture-leather: url('${base}/images/leather-texture.png');
          }
        `}} />
      </head>
      <body className="bg-charcoal text-parchment font-sans antialiased noise relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
