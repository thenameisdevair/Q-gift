"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { isMiniPay, requestMiniPayAddress } from "@/lib/minipay";
import { cn } from "@/lib/utils";

type Occasion = "Birthday" | "Anniversary" | "Graduation" | "Just Because";
type Template = "sunset" | "forest" | "ocean";

const OCCASIONS: { label: Occasion; emoji: string }[] = [
  { label: "Birthday", emoji: "🎂" },
  { label: "Anniversary", emoji: "💑" },
  { label: "Graduation", emoji: "🎓" },
  { label: "Just Because", emoji: "💝" },
];

const TEMPLATES: { id: Template; name: string; tagline: string; preview: string }[] = [
  {
    id: "sunset",
    name: "Sunset",
    tagline: "warm",
    preview:
      "linear-gradient(160deg, oklch(0.62 0.16 65) 0%, oklch(0.4 0.13 45) 60%, oklch(0.22 0.07 35) 100%)",
  },
  {
    id: "forest",
    name: "Forest",
    tagline: "earthen",
    preview:
      "linear-gradient(160deg, oklch(0.5 0.11 155) 0%, oklch(0.3 0.07 145) 60%, oklch(0.18 0.04 135) 100%)",
  },
  {
    id: "ocean",
    name: "Ocean",
    tagline: "deep",
    preview:
      "linear-gradient(160deg, oklch(0.5 0.11 215) 0%, oklch(0.3 0.08 230) 60%, oklch(0.16 0.04 250) 100%)",
  },
];

const MAX_MESSAGE = 100;
const MAX_NAME = 28;
const FORM_ID = "qgift-create-form";

type Stage = "checking" | "blocked" | "form" | "result";

export default function CreatePage() {
  const [stage, setStage] = useState<Stage>("checking");
  const [wallet, setWallet] = useState<`0x${string}` | null>(null);

  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState<Occasion>("Birthday");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState<Template>("sunset");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isMiniPay()) {
        if (mounted) setStage("blocked");
        return;
      }
      try {
        const addr = await requestMiniPayAddress();
        if (!mounted) return;
        if (!addr) {
          setStage("blocked");
          return;
        }
        setWallet(addr);
        setStage("form");
      } catch {
        if (mounted) setStage("blocked");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const giftUrl = useMemo(() => {
    if (!wallet) return "";
    const params = new URLSearchParams({
      name: name.trim(),
      occasion,
      message: message.trim(),
      template,
      wallet,
    });
    if (typeof window === "undefined") return `/gift?${params.toString()}`;
    return `${window.location.origin}/gift?${params.toString()}`;
  }, [name, occasion, message, template, wallet]);

  const canSubmit = stage === "form" && name.trim().length > 0;

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setStage("result");
  };

  const onCopy = async () => {
    if (!giftUrl) return;
    try {
      await navigator.clipboard.writeText(giftUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable; user can long-press URL */
    }
  };

  if (stage === "checking") {
    return (
      <main className="min-h-dvh flex items-center justify-center px-6">
        <div
          className="h-2 w-12 rounded-full bg-[var(--surface-2)] overflow-hidden relative"
          role="status"
          aria-label="Connecting to MiniPay"
        >
          <span className="absolute inset-y-0 left-0 w-1/2 bg-[var(--ice-tea)] animate-[rise_0.8s_ease-in-out_infinite_alternate]" />
        </div>
      </main>
    );
  }

  if (stage === "blocked") return <BlockedScreen />;
  if (stage === "result")
    return (
      <ResultScreen
        url={giftUrl}
        name={name}
        occasion={occasion}
        copied={copied}
        onCopy={onCopy}
        onReset={() => {
          setStage("form");
          setName("");
          setMessage("");
          setOccasion("Birthday");
          setTemplate("sunset");
        }}
      />
    );

  return <FormScreen
    formId={FORM_ID}
    name={name}
    setName={setName}
    occasion={occasion}
    setOccasion={setOccasion}
    message={message}
    setMessage={setMessage}
    template={template}
    setTemplate={setTemplate}
    canSubmit={canSubmit}
    onSubmit={onSubmit}
  />;
}

function FormScreen(props: {
  formId: string;
  name: string;
  setName: (v: string) => void;
  occasion: Occasion;
  setOccasion: (v: Occasion) => void;
  message: string;
  setMessage: (v: string) => void;
  template: Template;
  setTemplate: (v: Template) => void;
  canSubmit: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}) {
  const nameId = useId();
  const messageId = useId();

  return (
    <main className="min-h-dvh flex flex-col">
      <header
        className="px-6 pt-10 pb-6 animate-rise"
        style={{ animationDelay: "0ms" }}
      >
        <div className="font-display text-title text-[var(--text)]">QGift</div>
        <p className="font-body text-meta text-[var(--text-muted)] mt-1 max-w-[28ch]">
          Make a page your friends can send a gift to. Birthday, anniversary, just because.
        </p>
      </header>

      <form
        id={props.formId}
        onSubmit={props.onSubmit}
        className="flex-1 px-6 pb-36 flex flex-col gap-7"
        aria-label="Create gift page"
      >
        <Field
          label="What should we call you?"
          hint="The name your friends know."
          delay={60}
          htmlFor={nameId}
        >
          <input
            id={nameId}
            type="text"
            inputMode="text"
            autoComplete="given-name"
            value={props.name}
            onChange={(e) => props.setName(e.target.value.slice(0, MAX_NAME))}
            placeholder="e.g. Tunde"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 h-14 text-body text-[var(--text)] placeholder:text-[var(--text-soft)] focus:border-[var(--ice-tea)] focus:outline-none transition-colors duration-150"
            required
          />
        </Field>

        <Field label="What's the occasion?" delay={120}>
          <div
            role="radiogroup"
            aria-label="Occasion"
            className="-mx-6 px-6 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex gap-3 min-w-max pb-2">
              {OCCASIONS.map((o) => {
                const active = props.occasion === o.label;
                return (
                  <button
                    key={o.label}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => props.setOccasion(o.label)}
                    className={cn(
                      "min-w-[112px] h-[104px] rounded-xl flex flex-col items-center justify-center gap-1.5 px-3 active:scale-[0.98]",
                      "transition-[background-color,border-color,color,transform] duration-150 ease-out-quart",
                      active
                        ? "bg-[var(--ice-tea)] text-[var(--ice-tea-ink)] border border-[var(--ice-tea)]"
                        : "bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--ice-tea)]",
                    )}
                  >
                    <span className="text-[28px] leading-none" aria-hidden>
                      {o.emoji}
                    </span>
                    <span className="text-meta font-medium">{o.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Field>

        <Field
          label="Add a personal message"
          hint="Optional — the part they'll re-read."
          delay={180}
          htmlFor={messageId}
        >
          <div className="relative">
            <textarea
              id={messageId}
              value={props.message}
              onChange={(e) => props.setMessage(e.target.value.slice(0, MAX_MESSAGE))}
              placeholder="One sweet line is enough."
              rows={3}
              maxLength={MAX_MESSAGE}
              aria-describedby={`${messageId}-count`}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4 text-body text-[var(--text)] placeholder:text-[var(--text-soft)] focus:border-[var(--ice-tea)] focus:outline-none transition-colors duration-150"
            />
            <span
              id={`${messageId}-count`}
              className="absolute right-4 bottom-3 text-caption uppercase text-[var(--text-soft)] num"
              aria-live="polite"
            >
              {props.message.length} / {MAX_MESSAGE}
            </span>
          </div>
        </Field>

        <Field label="Pick a look" delay={240}>
          <div role="radiogroup" aria-label="Template" className="grid grid-cols-3 gap-3">
            {TEMPLATES.map((t) => {
              const active = props.template === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => props.setTemplate(t.id)}
                  className={cn(
                    "rounded-xl p-2 flex flex-col items-stretch gap-2 active:scale-[0.985]",
                    "transition-[border-color,transform] duration-150 ease-out-quart",
                    active
                      ? "border-2 border-[var(--ice-tea)]"
                      : "border border-[var(--border)] hover:border-[var(--ice-tea)]",
                  )}
                >
                  <div
                    className="aspect-[4/5] w-full rounded-lg"
                    style={{ background: t.preview }}
                    aria-hidden
                  />
                  <div className="px-1 pb-1 text-left">
                    <div className="text-meta font-semibold text-[var(--text)]">{t.name}</div>
                    <div className="text-caption uppercase text-[var(--text-soft)]">
                      {t.tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Field>
      </form>

      <div
        className="fixed bottom-0 inset-x-0 px-6 pt-4 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/95 to-transparent"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)" }}
      >
        <Button form={props.formId} type="submit" size="block" variant="primary" disabled={!props.canSubmit}>
          Create my gift page
        </Button>
      </div>
    </main>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  delay,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 animate-rise" style={delay ? { animationDelay: `${delay}ms` } : undefined}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="font-body text-body font-semibold text-[var(--text)]"
        >
          {label}
        </label>
        {hint ? <span className="text-caption uppercase text-[var(--text-soft)]">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function BlockedScreen() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center gap-8">
      <div className="flex flex-col items-center gap-4 animate-rise">
        <div
          aria-hidden
          className="w-20 h-20 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center"
        >
          <span className="font-display text-display-sm text-[var(--ice-tea)] leading-none">Q</span>
        </div>
        <h1 className="font-display text-title text-[var(--text)] max-w-[18ch]">
          Open QGift in MiniPay to create your gift page
        </h1>
        <p className="font-body text-body text-[var(--text-muted)] max-w-[28ch]">
          QGift uses your MiniPay wallet to receive gifts straight to your account — no extra apps.
        </p>
      </div>
      <a
        href="https://www.opera.com/products/minipay"
        target="_blank"
        rel="noreferrer"
        className="text-meta font-medium text-[var(--ice-tea)] underline-offset-4 hover:underline"
      >
        Get MiniPay →
      </a>
    </main>
  );
}

function ResultScreen({
  url,
  name,
  occasion,
  copied,
  onCopy,
  onReset,
}: {
  url: string;
  name: string;
  occasion: Occasion;
  copied: boolean;
  onCopy: () => void;
  onReset: () => void;
}) {
  const waLink = `https://wa.me/?text=${encodeURIComponent(`Send me a gift: ${url}`)}`;

  return (
    <main className="min-h-dvh flex flex-col items-center px-6 pt-10 pb-12">
      <div className="font-display text-title text-[var(--text)] mb-1">QGift</div>
      <p className="font-body text-meta text-[var(--text-muted)] mb-10 text-center">
        Your page is live. Share the link.
      </p>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm flex flex-col items-center gap-5 animate-bloom">
        <div className="bg-white rounded-xl p-4">
          <QRCodeSVG value={url} size={200} bgColor="#ffffff" fgColor="#0a1414" level="M" />
        </div>
        <div className="text-center">
          <div className="text-caption uppercase text-[var(--text-soft)]">For</div>
          <div className="font-display text-display-sm text-[var(--text)] leading-none mt-1.5">
            {name}
          </div>
          <div className="text-meta text-[var(--text-muted)] mt-1.5">{occasion}</div>
        </div>
        <div
          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-meta text-[var(--text-muted)] truncate"
          title={url}
        >
          {url}
        </div>
      </div>

      <p className="text-meta text-[var(--text-muted)] text-center mt-6 max-w-[34ch]">
        Show this QR or share the link. Anyone with MiniPay can send you a gift.
      </p>

      <div className="flex flex-col w-full max-w-sm gap-3 mt-8">
        <Button variant="primary" size="block" onClick={onCopy} aria-live="polite">
          {copied ? "Link copied" : "Copy link"}
        </Button>
        <Button variant="outline" size="block" asChild>
          <a href={waLink} target="_blank" rel="noreferrer">
            Share on WhatsApp
          </a>
        </Button>
        <Button variant="ghost" size="md" onClick={onReset} className="mt-2">
          Create another
        </Button>
      </div>
    </main>
  );
}
