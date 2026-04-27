import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — QGift",
  description: "Privacy Policy for QGift, a MiniPay mini app for sending cUSD gifts on Celo.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh flex flex-col px-6 pt-10 pb-16 max-w-[640px] mx-auto">
      <Link
        href="/create"
        className="inline-flex items-center gap-2 text-meta text-[var(--text-muted)] hover:text-[var(--ice-tea)] transition-colors duration-150 mb-8 self-start"
      >
        <span aria-hidden>←</span>
        <span>Back</span>
      </Link>

      <header className="mb-10">
        <h1 className="font-display text-title text-[var(--text)]">Privacy Policy</h1>
        <p className="font-body text-meta text-[var(--text-soft)] mt-2 uppercase tracking-wide">
          Last updated: April 27, 2026
        </p>
      </header>

      <div className="flex flex-col gap-8 font-body text-body text-[var(--text-muted)] leading-relaxed">
        <Section title="1. Information We Collect">
          QGift does not collect or store personal data. Your wallet address is read directly from
          your MiniPay wallet. Gift page data (name, occasion, message) is encoded in the URL only
          and never stored on our servers.
        </Section>

        <Section title="2. Blockchain Data">
          Transactions you make through QGift are recorded on the Celo blockchain, which is public
          and permanent.
        </Section>

        <Section title="3. Third Parties">
          QGift uses Vercel for hosting. No analytics, tracking, or advertising services are used.
        </Section>

        <Section title="4. Children">
          QGift is not intended for users under 18.
        </Section>

        <Section title="5. Changes">
          We may update this policy. Continued use of QGift constitutes acceptance of any changes.
        </Section>

        <Section title="6. Contact">
          For privacy questions, contact us at{" "}
          <a
            href="mailto:privacy@qgift.app"
            className="text-[var(--ice-tea)] underline-offset-4 hover:underline"
          >
            privacy@qgift.app
          </a>
          .
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-body text-body font-semibold text-[var(--text)]">{title}</h2>
      <p>{children}</p>
    </section>
  );
}
