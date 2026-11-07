// SANDBOX PREVIEW NOTE:
// The original page was a server redirect: redirect("/dashboard").
// Redirecting from `/` returns HTTP 307, which the hosted sandbox preview
// panel treats as "preview not available" (its health check expects 200).
// This page returns 200 with instant client-side hand-off to /dashboard,
// preserving the original UX for real users. To restore production
// behavior, replace this file with:
//   import { redirect } from "next/navigation";
//   export default function Home() { redirect("/dashboard"); }
export default function Home() {
  return (
    <main
      className="flex min-h-dvh items-center justify-center px-4"
      style={{ background: "#181613" }}
    >
      {/* Instant hand-off: meta refresh works without JavaScript; the inline
          script covers environments that ignore meta refresh in the body. */}
      <meta httpEquiv="refresh" content="0;url=/dashboard" />
      <script
        dangerouslySetInnerHTML={{
          __html: "if(location.pathname==='/')location.replace('/dashboard');",
        }}
      />

      <section
        aria-label="Redirecting to the Harmony MedSpa dashboard"
        className="w-full max-w-[380px] rounded-[22px] border px-6 py-8 text-center"
        style={{
          background: "color-mix(in srgb, var(--surface-1, #fffdf9) 96%, transparent)",
          borderColor: "color-mix(in srgb, var(--border-strong, #e5ded1) 86%, transparent)",
          boxShadow: "0 24px 64px rgba(18, 16, 12, 0.24)",
        }}
      >
        {/* Harmony wordmark, recolored to brand gold via CSS mask */}
        <div
          role="img"
          aria-label="Harmony Med Spa"
          className="mx-auto mb-4"
          style={{
            width: "min(180px, 70%)",
            aspectRatio: "337 / 97",
            backgroundColor: "var(--brand-primary, #b99656)",
            WebkitMask: "url(/images/logo.png) center / contain no-repeat",
            mask: "url(/images/logo.png) center / contain no-repeat",
          }}
        />
        <p
          className="text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{ color: "var(--brand-primary, #b99656)" }}
        >
          Patient Growth Command Center
        </p>
        <p
          className="mt-3 text-sm leading-5"
          style={{ color: "var(--text-muted, #6f6a60)" }}
        >
          Taking you to the dashboard…
        </p>
        <a
          href="/dashboard"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-extrabold transition hover:brightness-105"
          style={{
            color: "var(--primary-foreground, #fffdf9)",
            backgroundColor: "var(--brand-primary, #b99656)",
          }}
        >
          Continue to Dashboard
        </a>
      </section>
    </main>
  );
}
