'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type FAQ = { q: string; a: string }

function FAQItem({ item, index }: { item: FAQ; index: number }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!contentRef.current) return

    if (open) {
      gsap.fromTo(
        contentRef.current,
        { height: 0 },
        { height: 'auto', duration: 0.28, ease: 'power2.out' }
      )
    } else {
      gsap.to(contentRef.current, { height: 0, duration: 0.22, ease: 'power2.out' })
    }
  }, [open])

  return (
    <div className={
      'rounded-2xl bg-cream card-edge p-5 ' +
      (open ? 'border-l-4 border-l-amber' : '')
    }>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between gap-6 text-left"
        aria-expanded={open}
      >
        <div>
          <div className="text-xs uppercase tracking-widest text-muted">{String(index + 1).padStart(2, '0')}</div>
          <div className="mt-2 font-serif text-xl leading-snug text-charcoal">{item.q}</div>
        </div>
        <div className={
          'shrink-0 text-xs font-semibold tracking-widest ' +
          (open ? 'text-amber' : 'text-muted')
        }>
          {open ? 'CLOSE' : 'OPEN'}
        </div>
      </button>

      <div ref={contentRef} className="h-0 overflow-hidden">
        <div className="mt-4 text-[15px] font-light leading-relaxed text-muted">{item.a}</div>
      </div>
    </div>
  )
}

export default function Page() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  const heroRef = useRef<HTMLElement | null>(null)
  const heroGlowRef = useRef<HTMLDivElement | null>(null)
  const heroCardRef = useRef<HTMLDivElement | null>(null)

  const whyRef = useRef<HTMLElement | null>(null)
  const pricingRef = useRef<HTMLElement | null>(null)
  const pricingTitleRef = useRef<HTMLHeadingElement | null>(null)

  const tLeftRef = useRef<HTMLDivElement | null>(null)
  const tRightRef = useRef<HTMLDivElement | null>(null)

  const faqs: FAQ[] = useMemo(
    () => [
      {
        q: 'Do I need an account to take a test?',
        a: 'No. This demo app has no backend. Attempts live in sessionStorage so you can start, resume, and review results in one browser session.'
      },
      {
        q: 'How is MRQ partial scoring calculated?',
        a: 'You earn proportional credit for correct options selected, and lose proportional credit for incorrect selections (bounded by the configured negative marks).'
      },
      {
        q: 'Does the timer survive navigation?',
        a: 'Yes. The attempt stores startedAt, and the countdown derives from it, so navigation and refresh within a session won’t reset the test timer.'
      },
      {
        q: 'What about free-text answers?',
        a: 'Input questions normalize text (trim + lowercase). For numeric answers, a ±5% tolerance is applied.'
      },
      {
        q: 'Can I retake and compare attempts?',
        a: 'Completed attempts are kept in a local history list. This demo shows the last score badge on the Tests page.'
      }
    ],
    []
  )

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (heroCardRef.current) {
        gsap.fromTo(
          heroCardRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        )
      }

      if (heroGlowRef.current && heroRef.current) {
        gsap.to(heroGlowRef.current, {
          y: -160,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })
      }

      if (whyRef.current) {
        gsap.fromTo(
          whyRef.current.querySelectorAll('[data-why-card]'),
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: whyRef.current,
              start: 'top 75%'
            }
          }
        )
      }

      if (pricingRef.current && pricingTitleRef.current) {
        gsap.fromTo(
          pricingTitleRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: pricingRef.current,
              start: 'top 80%',
              end: 'top 40%',
              scrub: true
            }
          }
        )
      }

      if (tLeftRef.current && tRightRef.current) {
        gsap.to(tLeftRef.current, {
          x: -70,
          ease: 'none',
          scrollTrigger: {
            trigger: tLeftRef.current,
            start: 'top 90%',
            end: 'bottom top',
            scrub: true
          }
        })
        gsap.to(tRightRef.current, {
          x: 70,
          ease: 'none',
          scrollTrigger: {
            trigger: tRightRef.current,
            start: 'top 90%',
            end: 'bottom top',
            scrub: true
          }
        })
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      <section ref={heroRef} className="relative overflow-hidden bg-dark bg-dark-glow">
        <div
          ref={heroGlowRef}
          className="pointer-events-none absolute left-1/2 top-[-12%] h-[70vh] w-[70vh] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, rgba(224,123,57,0.18) 0%, rgba(61,32,16,0.55) 38%, rgba(17,16,16,0) 70%)'
          }}
        />

        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="font-serif text-[clamp(56px,8vw,96px)] font-extrabold leading-[0.9] text-white">
              Take tests.
              <br />
              Learn faster.
              <br />
              See everything.
            </h1>
            <p className="mt-6 max-w-[60ch] text-[16px] font-light leading-relaxed text-white/65">
              A warm, distraction-free test player with question-level timing, rich scoring, and analytics that actually tell you what to fix.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/tests" variant="primary">
                Start a Test
              </Button>
              <Button href="#pricing" variant="secondary" className="border border-white/20 text-white hover:bg-white/10">
                View Pricing
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-white/60">
              <Badge variant="dark">No backend</Badge>
              <Badge variant="dark">Zustand state</Badge>
              <Badge variant="dark">Lenis + GSAP</Badge>
            </div>
          </div>

          <div ref={heroCardRef} className="rounded-3xl bg-dark/60 border border-white/12 p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-white/60">Test preview</div>
              <Badge variant="dark">MCQ • MRQ • INPUT</Badge>
            </div>

            <div className="mt-6 rounded-2xl bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-white/60">Question 3/10</div>
                <div className="text-sm font-medium text-amber">02:41</div>
              </div>
              <div className="mt-4 font-serif text-2xl leading-snug text-white">
                Which of these are renewable energy sources?
              </div>
              <div className="mt-4 grid gap-2">
                {['Solar power', 'Coal', 'Wind power', 'Hydroelectric power'].map((label) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                  >
                    <div className="h-5 w-5 rounded-md border border-white/20" />
                    {label}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="text-xs text-white/50">Partial credit + penalties</div>
                <div className="text-xs font-semibold tracking-widest text-white/70">NEXT →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={whyRef} className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-muted">Why us</div>
            <h2 className="mt-4 font-serif text-5xl leading-[0.98]">Built for Serious Test-Takers</h2>
            <p className="mt-5 text-[16px] font-light leading-relaxed text-muted">
              Every interaction is shaped for focus: clean typography, honest scoring, and analytics you can act on.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Adaptive Timer',
                desc: 'Question-level time tracking that survives navigation and refresh within the session.',
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 8V12L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )
              },
              {
                title: 'Deep Analytics',
                desc: 'Accuracy by type, time distribution, and topic-level recommendations based on real answers.',
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M10 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 19V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M22 19V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )
              },
              {
                title: 'All Question Types',
                desc: 'MCQ, MRQ with partial scoring, and free-text input with numeric tolerance.',
                icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 7H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 12H14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 17H18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )
              }
            ].map((f) => (
              <div
                key={f.title}
                data-why-card
                className="rounded-3xl bg-cream card-edge p-6"
              >
                <div className="text-amber">{f.icon}</div>
                <div className="mt-5 font-serif text-2xl">{f.title}</div>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={pricingRef} id="pricing" className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="text-xs uppercase tracking-widest text-muted">Pricing</div>
          <h2 ref={pricingTitleRef} className="mt-4 font-serif text-5xl leading-[0.98]">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] font-light leading-relaxed text-muted">
            Start free. Upgrade when you need deeper exports and team analytics.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-cream card-edge p-7">
              <div className="font-serif text-2xl">Free</div>
              <div className="mt-3 text-sm text-muted">For quick practice sessions.</div>
              <div className="mt-6 font-serif text-4xl">$0</div>
              <ul className="mt-6 grid gap-3 text-sm text-muted">
                <li>✓ Take all mock tests</li>
                <li>✓ Session persistence</li>
                <li>— Team dashboards</li>
              </ul>
              <div className="mt-8">
                <Button href="/tests" variant="secondary" className="w-full">
                  Start
                </Button>
              </div>
            </div>

            <div className="relative rounded-3xl bg-dark text-white border border-white/12 p-7">
              <div className="absolute right-6 top-6 rounded-full bg-amber px-3 py-1 text-xs font-semibold text-dark">
                Most Popular
              </div>
              <div className="font-serif text-2xl">Pro</div>
              <div className="mt-3 text-sm text-white/70">For daily test-takers.</div>
              <div className="mt-6 font-serif text-4xl">$9</div>
              <ul className="mt-6 grid gap-3 text-sm text-white/75">
                <li>✓ Unlimited attempts</li>
                <li>✓ Deeper analytics</li>
                <li>✓ Topic recommendations</li>
              </ul>
              <div className="mt-8">
                <Button href="/tests" variant="primary" className="w-full">
                  Go Pro
                </Button>
              </div>
            </div>

            <div className="rounded-3xl bg-cream card-edge p-7">
              <div className="font-serif text-2xl">Team</div>
              <div className="mt-3 text-sm text-muted">For educators and cohorts.</div>
              <div className="mt-6 font-serif text-4xl">$29</div>
              <ul className="mt-6 grid gap-3 text-sm text-muted">
                <li>✓ Team analytics</li>
                <li>✓ Shared reports</li>
                <li>✓ Admin controls</li>
              </ul>
              <div className="mt-8">
                <Button href="/tests" variant="secondary" className="w-full">
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="text-xs uppercase tracking-widest text-muted">Testimonials</div>
          <h2 className="mt-4 font-serif text-5xl leading-[0.98]">Loved by Students & Educators</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div ref={tLeftRef} className="grid gap-6">
              {[{ name: 'Aisha', role: 'Student' }, { name: 'Rohan', role: 'Aspirant' }, { name: 'Mina', role: 'Student' }].map(
                (p) => (
                  <div key={p.name} className="rounded-3xl bg-cream card-edge p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-cream font-semibold">
                          {p.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-medium text-charcoal">{p.name}</div>
                          <div className="text-xs text-muted">{p.role}</div>
                        </div>
                      </div>
                      <div className="text-amber">★★★★★</div>
                    </div>
                    <p className="mt-5 text-[15px] font-light leading-relaxed text-muted">
                      “The per-question timing changed how I revise. I finally know where I’m slow — and why.”
                    </p>
                  </div>
                )
              )}
            </div>

            <div ref={tRightRef} className="grid gap-6">
              {[{ name: 'Dr. Sen', role: 'Educator' }, { name: 'Ishan', role: 'Student' }, { name: 'Neha', role: 'Educator' }].map(
                (p) => (
                  <div key={p.name} className="rounded-3xl bg-cream card-edge p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-cream font-semibold">
                          {p.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-medium text-charcoal">{p.name}</div>
                          <div className="text-xs text-muted">{p.role}</div>
                        </div>
                      </div>
                      <div className="text-amber">★★★★★</div>
                    </div>
                    <p className="mt-5 text-[15px] font-light leading-relaxed text-muted">
                      “It’s rare to see analytics that are both precise and readable. The UI feels calm and intentional.”
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="text-xs uppercase tracking-widest text-muted">FAQ</div>
          <h2 className="mt-4 font-serif text-5xl leading-[0.98]">Questions, answered.</h2>
          <p className="mt-5 max-w-2xl text-[16px] font-light leading-relaxed text-muted">
            Straight talk about scoring, storage, and how this demo works.
          </p>

          <div className="mt-10 grid gap-4">
            {faqs.map((f, idx) => (
              <FAQItem key={f.q} item={f} index={idx} />
            ))}
          </div>

          <div className="mt-12 text-sm text-muted">
            Want to explore?{' '}
            <Link href="/tests" className="text-amber underline-offset-4 hover:underline">
              Browse available tests
            </Link>
            .
          </div>
        </div>
      </section>
    </div>
  )
}
