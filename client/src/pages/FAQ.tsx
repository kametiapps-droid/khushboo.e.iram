import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileMenu } from "@/components/MobileMenu";
import { CartDrawer } from "@/components/CartDrawer";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const faqs = [
    {
      question: "Are all your products 100% authentic?",
      answer: "Yes, absolutely. We source all our perfumes, attar, and body sprays directly from authorized distributors and authentic suppliers. Every product comes with authenticity guarantees and original packaging."
    },
    {
      question: "How long does delivery take?",
      answer: "We offer delivery across Pakistan. Standard delivery takes 3-5 business days for major cities and 5-7 business days for other areas. Express delivery options are also available at checkout."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 7 days of delivery if the product is unopened and in its original packaging. For damaged or defective items, please contact us within 24 hours of delivery for a full refund or replacement."
    },
    {
      question: "Do you offer Cash on Delivery (COD)?",
      answer: "Yes, we offer COD for orders across Pakistan. You can pay in cash when your order is delivered to your doorstep."
    },
    {
      question: "How should I store my perfumes?",
      answer: "Store perfumes in a cool, dry place away from direct sunlight and heat. Keep them in their original boxes when not in use to preserve the fragrance quality and longevity."
    },
    {
      question: "What's the difference between perfume, attar, and body spray?",
      answer: "Perfumes are alcohol-based fragrances with high concentration of oils. Attar is a traditional oil-based fragrance without alcohol, often more concentrated and long-lasting. Body sprays are lighter, water-based fragrances perfect for everyday use."
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes! We offer complimentary gift wrapping service. Simply select the gift wrap option during checkout, and we'll beautifully package your purchase."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via SMS and email. You can use this number to track your package on our website or the courier's website."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Cash on Delivery (COD), bank transfers, credit/debit cards, and JazzCash/EasyPaisa mobile wallet payments for your convenience."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "You can cancel or modify your order within 2 hours of placement by contacting our customer service. Once the order is processed and shipped, cancellation is not possible, but you can return it according to our return policy."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={0}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <MobileMenu isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <main className="flex-1">
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light mb-4 text-center">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Find answers to common questions about our products and services
              </p>

              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-12 p-6 bg-muted/50 rounded-lg text-center">
                <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Our customer service team is here to help
                </p>
                <a href="/contact" className="text-primary hover:underline font-medium">
                  Contact Us →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={[]}
        onUpdateQuantity={() => {}}
        onRemove={() => {}}
        onCheckout={() => {}}
      />
    </div>
  );
}
