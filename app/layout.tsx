import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'WpDev Keyboard — Engineered Clarity',
    description: 'WpDev is a precision-engineered mechanical keyboard built for those who care about every detail. Layered engineering, assembled to perfection.',
    keywords: ['WpDev', 'mechanical keyboard', 'precision keyboard', 'engineering'],
    openGraph: {
        title: 'WpDev Keyboard — Engineered Clarity',
        description: 'Built for Precision. Layered Engineering. See what\'s inside.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body>{children}</body>
        </html>
    )
}
