"use client";

import { Suspense, useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isMiniPay } from "@/lib/minipay";
import { sendGift } from "@/lib/send-gift";
import { cn } from "@/lib/utils";

type Template = "sunset" | "forest" | "ocean";

const TEMPLATE_GRADIENT: Record<Template, string> = {
  sunset:
    "radial-gradient(150% 95% at 78% 105%, oklch(0.66 0.17 65) 0%, oklch(0.42 0.14 45) 38%, oklch(0.22 0.07 35) 78%, oklch(0.13 0.04 35) 100%)",
  forest:
    "radial-gradient(150% 95% at 22% 105%, oklch(0.55 0.13 155) 0%, oklch(0.32 0.07 145) 38%, oklch(0.2 0.04 135) 78%, oklch(0.13 0.025 130) 100%)",
  ocean:
    "radial-gradient(150% 95% at 50% 110%, oklch(0.55 0.13 215) 0%, oklch(0.32 0.08 230) 38%, oklch(0.18 0.04 250) 78%, oklch(0.12 0.03 250) 100%)",
};

const TEMPLATE_OVERLAY =
  "linear-gradient(180deg, oklch(0 0 0 / 0.28) 0%, oklch(0 0 0 / 0) 32%, oklch(0 0 0 / 0) 70%, oklch(0 0 0 / 0.22) 100%)";

const OCCASION_EMOJI: Record<string, string> = {
  Birthday: "🎂",
  Anniversary: "💑",
  Graduation: "🎓",
  "Just Because": "💝",
};

const PRESETS = ["1", "2", "5"] as const;

type SendStage = "idle" | "sending" | "sent" | "error";

function isValidAmount(v: string): boolean {
  if (!v) return false;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0.01;
}

function isHexAddress(v: string | null | undefined): v is `0x${string}` {
  return Boolean(v && /^0x[a-fA-F0-9]{40}$/.test(v));
}

function buildHeadline(name: string, occasion: string): string {
  if (occasion === "Just Because") return `Send ${name} a gift, just because`;
  return `Send ${name} a ${occasion.toLowerCase()} gift`;
}

export default function GiftPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh flex items-center justify-center bg-[var(--bg)]">
          <div className="h-2 w-12 rounded-full bg-[var(--surface-2)]" />
        </main>
      }
    >
      <GiftInner />
    </Suspense>
  );
}

function GiftInner() {
  const params = useSearchParams();
  const name = (params?.get("name") || "your friend").trim();
  const occasion = params?.get("occasion") || "Birthday";
  const message = params?.get("message") || "";
  const templateParam = (params?.get("template") || "sunset") as Template;
  const template: Template = ["sunset", "forest", "ocean"].includes(templateParam)
    ? templateParam
    : "sunset";
  const wallet = params?.get("wallet") ?? null;
  const recipientValid = isHexAddress(wallet);

  const [preset, setPreset] = useState<(typeof PRESETS)[number] | null>("2");
  const [custom, setCustom] = useState<string>("");
  const [stage, setStage] = useState<SendStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const customId = useId();

  const amount = custom ? custom : (preset ?? "");
  const customValid = !custom || isValidAmount(custom);
  const canSend = isValidAmount(amount) && recipientValid;

  useEffect(() => {
    if (custom) setPreset(null);
  }, [custom]);

  const onPickPreset = (p: (typeof PRESETS)[number]) => {
    setPreset(p);
    setCustom("");
  };

  const onSend = async () => {
    setError(null);
    if (!canSend || !wallet) return;
    if (!isMiniPay()) {
      setShowOverlay(true);
      return;
    }
    setStage("sending");
    try {
      const txHash = await sendGift({
        recipient: wallet as `0x${string}`,
        amount,
        occasion,
        message,
      });
      setHash(txHash);
      setStage("sent");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong sending the gift.";
      setError(msg);
      setStage("error");
    }
  };

  const headline = useMemo(() => buildHeadline(name, occasion), [name, occasion]);

  return (
    <main
      className="min-h-dvh flex flex-col text-white"
      style={{ background: `${TEMPLATE_OVERLAY}, ${TEMPLATE_GRADIENT[template]}` }}
    >
      {stage === "sent" && hash ? (
        <SentScreen name={name} amount={amount} hash={hash} />
      ) : (
        <>
          <div className="flex-1 flex flex-col px-6 pt-12 pb-36">
            <div
              className="text-[64px] leading-none text-center mb-7 animate-rise"
              style={{ animationDelay: "0ms" }}
              aria-hidden
            >
              {OCCASION_EMOJI[occasion] ?? "💝"}
            </div>
            <h1
              className="font-display text-display-sm sm:text-display text-white text-center max-w-[18ch] mx-auto leading-[1.05] animate-rise"
              style={{ animationDelay: "80ms" }}
            >
              {headline}
            </h1>
            {message ? (
              <p
                className="font-body text-body text-white/85 text-center max-w-[28ch] mx-auto mt-5 animate-rise"
                style={{ animationDelay: "160ms" }}
              >
                &ldquo;{message}&rdquo;
              </p>
            ) : null}

            {!recipientValid ? (
              <div
                role="alert"
                className="mt-12 mx-auto max-w-[34ch] text-center text-meta bg-black/35 border border-white/15 rounded-xl px-4 py-3"
              >
                This gift link is missing a wallet. Ask {name} to share a fresh link from QGift.
              </div>
            ) : (
              <div
                className="mt-12 flex-1 flex flex-col gap-5 animate-rise"
                style={{ animationDelay: "240ms" }}
              >
                <div className="text-caption uppercase text-white/70 text-center">
                  Choose an amount
                </div>
                <div role="radiogroup" aria-label="Preset amount" className="grid grid-cols-3 gap-3">
                  {PRESETS.map((p) => {
                    const active = preset === p && !custom;
                    return (
                      <button
                        key={p}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onPickPreset(p)}
                        className={cn(
                          "h-16 rounded-xl border font-display text-lead text-center num active:scale-[0.97]",
                          "transition-[background-color,border-color,color,transform] duration-150 ease-out-quart",
                          active
                            ? "bg-[var(--gold)] border-[var(--gold)] text-[oklch(0.18_0.04_80)]"
                            : "bg-white/5 border-white/15 text-white hover:border-white/40",
                        )}
                      >
                        ${p}
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label htmlFor={customId} className="text-caption uppercase text-white/70">
                    Or enter amount
                  </label>
                  <div className="mt-2 relative">
                    <span
                      aria-hidden
                      className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-lead text-white/70 num pointer-events-none"
                    >
                      $
                    </span>
                    <input
                      id={customId}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                      aria-invalid={!customValid}
                      className={cn(
                        "w-full h-14 rounded-xl bg-white/5 border pl-9 pr-4 font-display text-lead text-white placeholder:text-white/40 num focus:outline-none transition-colors duration-150",
                        custom && customValid && "border-[var(--gold)]",
                        custom && !customValid && "border-white/40",
                        !custom && "border-white/15",
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {stage === "error" && error ? (
              <div
                role="alert"
                className="mt-6 mx-auto max-w-[34ch] text-meta text-center bg-black/35 border border-white/15 rounded-xl px-4 py-3"
              >
                {error}
              </div>
            ) : null}
          </div>

          <div
            className="fixed inset-x-0 bottom-0 px-6 pt-4"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)" }}
          >
            <Button
              variant="gold"
              size="block"
              onClick={onSend}
              disabled={!canSend || stage === "sending"}
              aria-busy={stage === "sending"}
            >
              {stage === "sending" ? <SendingLabel /> : "Send gift 💝"}
            </Button>
          </div>
        </>
      )}

      {showOverlay ? <NotMiniPayOverlay onClose={() => setShowOverlay(false)} /> : null}
    </main>
  );
}

function SendingLabel() {
  return (
    <span className="inline-flex items-center gap-2">
      Sending
      <span aria-hidden className="inline-flex gap-0.5">
        <span className="inline-block w-1 h-1 rounded-full bg-current animate-[rise_0.7s_ease-in-out_infinite_alternate]" />
        <span
          className="inline-block w-1 h-1 rounded-full bg-current animate-[rise_0.7s_ease-in-out_0.15s_infinite_alternate]"
        />
        <span
          className="inline-block w-1 h-1 rounded-full bg-current animate-[rise_0.7s_ease-in-out_0.3s_infinite_alternate]"
        />
      </span>
    </span>
  );
}

function SentScreen({
  name,
  amount,
  hash,
}: {
  name: string;
  amount: string;
  hash: `0x${string}`;
}) {
  const short = `${hash.slice(0, 6)}…${hash.slice(-4)}`;
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center text-white">
      <div className="text-[80px] leading-none mb-8 animate-bloom" aria-hidden>
        🎉
      </div>
      <h2
        className="font-display text-display-sm text-white max-w-[18ch] animate-rise"
        style={{ animationDelay: "120ms" }}
      >
        {name} will love this
      </h2>
      <p
        className="font-body text-body text-white/85 mt-4 max-w-[30ch] animate-rise num"
        style={{ animationDelay: "200ms" }}
      >
        Your gift of ${amount} is on its way.
      </p>
      <a
        href={`https://celoscan.io/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
        className="mt-8 text-meta font-medium text-white/90 underline underline-offset-4 hover:text-white num animate-rise"
        style={{ animationDelay: "280ms" }}
      >
        View on Celoscan · {short}
      </a>
    </div>
  );
}

function NotMiniPayOverlay({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-10 bg-black/65 px-6 flex items-end sm:items-center justify-center animate-bloom"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[var(--bg)] border border-[var(--border)] rounded-t-2xl sm:rounded-2xl p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div id={titleId} className="font-display text-title text-[var(--text)]">
          Open in MiniPay to send
        </div>
        <p className="font-body text-body text-[var(--text-muted)] mt-3 max-w-[32ch] mx-auto">
          QGift sends gifts in cUSD through your MiniPay wallet. Open this same link inside MiniPay
          to continue.
        </p>
        <div className="flex flex-col gap-3 mt-6">
          <Button asChild size="block" variant="primary">
            <a href="https://www.opera.com/products/minipay" target="_blank" rel="noreferrer">
              Get MiniPay
            </a>
          </Button>
          <Button ref={closeBtnRef} variant="ghost" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
