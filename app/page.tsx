import KeyboardScroll from '@/components/KeyboardScroll'

export default function Home() {
    return (
        <main style={{ position: 'relative', width: '100%', margin: 0, padding: 0 }}>
            {/* Minimal Nav */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
                style={{ background: 'transparent' }}
            >
                <span className="nav-logo">WpDev</span>
                <div className="flex items-center gap-8">
                    <a
                        href="#"
                        className="text-xs font-medium tracking-widest uppercase"
                        style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                    >
                        Keyboards
                    </a>
                    <a
                        href="#"
                        className="text-xs font-medium tracking-widest uppercase"
                        style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                    >
                        Studio
                    </a>
                    <a
                        href="#"
                        className="text-xs font-medium tracking-widest uppercase"
                        style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                    >
                        Order
                    </a>
                </div>
            </nav>

            {/* Keyboard Scroll Experience */}
            <KeyboardScroll />

            {/* Footer */}
            <footer
                className="flex items-center justify-between px-8 py-8"
                style={{ backgroundColor: 'var(--fog)' }}
            >
                <span className="footer-text">© 2024 WpDev Technologies</span>
                <div className="flex items-center gap-6">
                    <span className="footer-text">Privacy</span>
                    <span className="footer-text">Terms</span>
                    <span className="footer-text">Contact</span>
                </div>
            </footer>
        </main>
    )
}
