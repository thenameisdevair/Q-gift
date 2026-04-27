import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — QGift",
  description: "Terms of Service for QGift, a MiniPay mini app for sending cUSD gifts on Celo.",
};

export default function TermsPage() {
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
        <h1 className="font-display text-title text-[var(--text)]">Terms of Service</h1>
        <p className="font-body text-meta text-[var(--text-soft)] mt-2 uppercase tracking-wide">
          Last updated: April 27, 2026
        </p>
      </header>

      <div className="flex flex-col gap-8 font-body text-body text-[var(--text-muted)] leading-relaxed">
        <Section title="1. Acceptance of Terms">
          QGift is a MiniPay mini app that enables users to send cUSD gifts to other MiniPay users on
          the Celo blockchain. By using QGift, you agree to these terms.
        </Section>

        <Section title="2. Eligibility">
          You must be 18 or older and have an active MiniPay wallet to use QGift.
        </Section>

        <Section title="3. Transactions">
          All gift transactions are processed on the Celo blockchain and are irreversible. QGift does
          not hold, custody, or control any user funds. Transactions are peer-to-peer.
        </Section>

        <Section title="4. Prohibited Use">
          You may not use QGift for money laundering, fraud, or any illegal activity.
        </Section>

        <Section title="5. Disclaimer">
          QGift is provided as-is. We are not liable for transaction failures, network issues, or
          loss of funds due to user error.
        </Section>

        <Section title="6. Contact">
          For support, contact us at{" "}
          <a
            href="mailto:support@qgift.app"
            className="text-[var(--ice-tea)] underline-offset-4 hover:underline"
          >
            support@qgift.app
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
