import EnquiryForm from '@/components/EnquiryForm';
import { buildWhatsAppUrl, buildTelUrl } from '@/lib/contact-urls';
import type { ContactConfig } from '@/lib/types';
import ScrollReveal from '@/components/ScrollReveal';

interface ContactSectionProps {
  contact: ContactConfig | null;
}

const DEFAULT_PHONE = '+919999999999';
const DEFAULT_MESSAGE = 'Hi, I am interested in LODHA SADAHALLI. Please share more details.';

export default function ContactSection({ contact }: ContactSectionProps) {
  const phone = contact?.phoneNumber ?? DEFAULT_PHONE;
  const message = contact?.whatsappMessage ?? DEFAULT_MESSAGE;

  return (
    <section id="contact" className="bg-luxury-stone py-24 px-4 border-b border-luxury-charcoal/5">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal animation="fadeUp">
          <div className="flex flex-col items-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-luxury-charcoal text-center mb-4">
              Get In Touch
            </h2>
            <div className="w-16 h-[1px] bg-luxury-gold mb-6" />
            <p className="text-luxury-gold/80 text-center text-xs md:text-sm uppercase tracking-[0.2em]">
              LODHA SADAHALLI — We&apos;d love to hear from you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
                <p className="font-serif text-2xl text-luxury-charcoal mb-2">Reach Out Directly</p>
                <p className="text-luxury-charcoal/60 text-sm leading-relaxed mb-4">
                  Prefer to speak with us? Give us a call or send a message on WhatsApp for an immediate response.
                </p>
                <a
                  href={buildWhatsAppUrl(phone, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 flex items-center justify-center gap-4 border border-[#25D366]/30 bg-[#25D366]/5 text-[#25D366] font-light tracking-[0.1em] uppercase text-xs hover:bg-[#25D366] hover:text-white transition-all duration-300 rounded-full"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Us
                </a>
                <a
                  href={buildTelUrl(phone)}
                  className="w-full py-4 flex items-center justify-center gap-4 border border-luxury-charcoal bg-transparent text-luxury-charcoal font-light tracking-[0.1em] uppercase text-xs hover:bg-luxury-charcoal hover:text-luxury-stone transition-all duration-300 rounded-full"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  Call Now
                </a>
              </div>
            </div>

            {/* Enquiry form */}
            <div className="bg-luxury-black p-8 md:p-12 border border-luxury-stone/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative rounded-[2.5rem] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-luxury-gold/20 via-luxury-gold to-luxury-gold/20" />
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold/5 rounded-full blur-[80px]" />
              <h3 className="font-serif text-3xl font-light text-luxury-stone mb-8 text-center tracking-wide">Register Interest</h3>
              <EnquiryForm />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
