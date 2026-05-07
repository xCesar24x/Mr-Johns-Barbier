import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import History from "@/components/History";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import BookingSystem from "@/components/BookingSystem";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <History />
      <Services />
      <Gallery />
      <BookingSystem />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
