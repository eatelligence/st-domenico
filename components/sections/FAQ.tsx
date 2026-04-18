import ScrollReveal from '@/components/ui/ScrollReveal'

const faqs = [
  {
    question: 'What makes St Domenico\'s pizza "Neapolitan"?',
    answer:
      'Neapolitan pizza follows a centuries-old tradition originating in Naples, Italy. At St Domenico, this means hand-stretched dough made with Italian "00" flour, San Marzano tomatoes grown in the volcanic soil of Mount Vesuvius, fresh fior di latte, and cooking in a wood-fired oven at 450°C for 60–90 seconds. The result is a thin, soft base with a puffy, charred cornicione (crust edge) that cannot be replicated in a conventional oven.',
  },
  {
    question: 'What are the best pizzas to order at St Domenico in Richmond?',
    answer:
      'Customer favourites include the Margherita (San Marzano tomato, fior di latte, basil — the classic benchmark), the Della Lupa (nduja, honey, burrata — sweet heat contrast), and the Tartufo (mushrooms, truffle oil, parmigiano). If you want a deep flavour experience, the Quattro Formaggi with gorgonzola, pecorino, parmigiano, and fior di latte is a standout. All pizzas are available with a gluten-free base for a small surcharge.',
  },
  {
    question: 'Does St Domenico offer gluten-free pizza?',
    answer:
      'Yes. A gluten-free pizza base is available for all pizzas on the menu for an additional $3. Please inform your server of any gluten sensitivity or coeliac requirements when ordering, and note that while every care is taken, our kitchen handles gluten-containing products.',
  },
  {
    question: 'Can I bring my own wine to St Domenico?',
    answer:
      'Yes — St Domenico is BYO wine with no corkage fee. You are welcome to bring your favourite bottle of wine to enjoy with your meal. We also offer a curated selection of Italian and Australian wines by the glass if you prefer to order from our drinks list.',
  },
  {
    question: 'How do I book a table at St Domenico in Richmond?',
    answer:
      'You can book online directly through our website using the Reserve Your Table form, which is powered by the Oddle booking system. Alternatively, call us on 0468 318 624 during opening hours. We are open Tuesday to Sunday from 4:30pm. We offer two sittings: 5:00pm–7:00pm and 7:15pm–10:00pm, with a maximum of 10 guests per online booking.',
  },
  {
    question: 'What days and hours is St Domenico open?',
    answer:
      'St Domenico Pizza Bar is open Tuesday through Sunday, 4:30pm to 10:00pm. We are closed on Mondays. We are located at 428 Bridge Road, Richmond VIC 3121, in Melbourne\'s inner east. Street parking is available on Bridge Road and surrounding streets.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-24 lg:py-32 bg-cream grain-overlay"
      aria-labelledby="faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="font-bebas text-terracotta tracking-[0.4em] text-sm">
              Common Questions
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              id="faq-heading"
              className="font-playfair italic text-4xl lg:text-5xl text-charcoal mt-3 mb-4"
            >
              Everything You&apos;d Like to Know
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="gold-divider" />
          </ScrollReveal>
        </div>

        {/* FAQ items */}
        <div className="space-y-0 divide-y divide-gold/15">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.07}>
              <div className="py-7">
                <h3 className="font-playfair text-lg font-semibold text-charcoal mb-3 leading-snug">
                  {faq.question}
                </h3>
                <p className="font-inter text-[16px] text-charcoal/65 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.5}>
          <div className="text-center mt-12 pt-10 border-t border-gold/15">
            <p className="font-inter text-charcoal/50 text-sm mb-5">
              Still have questions? We&apos;re happy to help.
            </p>
            <a
              href="tel:+61468318624"
              className="inline-flex items-center gap-2 font-bebas text-sm tracking-[0.25em] text-terracotta border border-terracotta/40 px-8 py-3 hover:bg-terracotta hover:text-cream transition-all duration-300"
            >
              Call Us · 0468 318 624
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
