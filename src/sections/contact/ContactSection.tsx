import React from 'react';
import { Section } from '@/components/ui/layout/Section';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Button } from '@/components/ui/Button';
import { ContactConnectionMatrix } from '@/components/contact/ContactConnectionMatrix';
import { CONTACT_CONTENT } from '@/data/contactContent';

export const ContactSection: React.FC = () => {
  const isEmailConfigured = !CONTACT_CONTENT.email.includes('PENDING');

  return (
    <Section id="contact" index="07" label={CONTACT_CONTENT.sectionLabel}>
      <div className="space-y-12">
        {/* Section Lead & Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Monumental Headline & Core Message */}
          <div className="lg:col-span-6 space-y-6">
            <TechnicalLabel indicator indicatorColor="accent">
              {CONTACT_CONTENT.eyebrow}
            </TechnicalLabel>

            <DisplayText as="h2" size="xl" className="leading-[0.92] tracking-tightest font-extrabold uppercase text-foreground">
              IF SOMETHING HERE<br />
              CAUGHT YOUR ATTENTION,<br />
              <span className="text-accent">LET'S BUILD.</span>
            </DisplayText>

            <p className="text-foreground-secondary text-base sm:text-lg leading-relaxed font-normal pt-2">
              {CONTACT_CONTENT.lead}
            </p>

            <div className="pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {isEmailConfigured ? (
                  <a
                    href={`mailto:${CONTACT_CONTENT.email}`}
                    className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent w-full sm:w-auto"
                  >
                    <Button
                      variant="magnetic"
                      className="w-full sm:w-auto tracking-widest text-xs uppercase px-8 py-4 justify-center min-h-[44px]"
                    >
                      INITIATE TRANSMISSION →
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full sm:w-auto tracking-widest text-xs uppercase px-8 py-4 justify-center opacity-60 cursor-not-allowed border-border/80 text-foreground-muted min-h-[44px]"
                  >
                    EMAIL CHANNEL PENDING
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase text-foreground-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-foreground">{CONTACT_CONTENT.status}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Connection Matrix & Communication Channels */}
          <div className="lg:col-span-6">
            <ContactConnectionMatrix />
          </div>
        </div>
      </div>
    </Section>
  );
};
