import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-subtle bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-serif italic text-xl">TestPlayer</div>
          <p className="mt-3 text-sm text-muted">
            A warm, focused test-taking experience with serious analytics.
          </p>
        </div>

        <div className="grid gap-2 text-sm text-muted">
          <div className="font-sans text-xs uppercase tracking-widest text-charcoal">Product</div>
          <Link className="hover:text-charcoal" href="/tests">
            Tests
          </Link>
          <a className="hover:text-charcoal" href="#pricing">
            Pricing
          </a>
        </div>

        <div className="grid gap-2 text-sm text-muted">
          <div className="font-sans text-xs uppercase tracking-widest text-charcoal">Company</div>
          <a className="hover:text-charcoal" href="#">
            About
          </a>
          <a className="hover:text-charcoal" href="#">
            Contact
          </a>
        </div>

        <div className="grid gap-2 text-sm text-muted">
          <div className="font-sans text-xs uppercase tracking-widest text-charcoal">Legal</div>
          <a className="hover:text-charcoal" href="#">
            Privacy
          </a>
          <a className="hover:text-charcoal" href="#">
            Terms
          </a>
        </div>
      </div>

      <div className="border-t border-subtle">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 text-xs text-muted">
          <div>© {new Date().getFullYear()} TestPlayer. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter" className="hover:text-charcoal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.6 2.4H21.9L14.7 10.6L23.2 21.6H16.5L11.2 14.8L5.2 21.6H1.9L9.6 12.8L1.4 2.4H8.2L13 8.6L18.6 2.4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </a>
            <a href="#" aria-label="GitHub" className="hover:text-charcoal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 19C4.5 20.5 4.5 16.5 2.5 16M21.5 22V18.5C21.5 17.5 21.6 16.9 21 16.2C23 14 20.9 10 20 8.5C19.7 7.7 19.3 7.1 18.7 6.6C17 5.1 14 5.1 12 5.1C10 5.1 7 5.1 5.3 6.6C4.7 7.1 4.3 7.7 4 8.5C3.1 10 1 14 3 16.2C2.4 16.9 2.5 17.5 2.5 18.5V22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
