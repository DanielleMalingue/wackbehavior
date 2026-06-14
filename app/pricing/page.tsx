import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PricingSection from "../components/PricingSection";

export const metadata: Metadata = {
  title: "Pricing · Wackbehavior",
  description:
    "Simple, credit-based pricing for the AI fashion design studio. Pay monthly or save 20% annually. Start free — no credit card required.",
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main>
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
