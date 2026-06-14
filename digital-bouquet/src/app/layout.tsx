import type { Metadata } from 'next';
import { Caveat, Dancing_Script, Fredoka, Playfair_Display, Quicksand } from 'next/font/google';
import '../index.css';

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-dancing-script',
});

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-fredoka',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['500', '600', '700'],
  variable: '--font-playfair',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: 'For You — Cinematic Love Letter',
  description: 'Create a cinematic digital love letter with photos, music, and a handwritten final note.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${dancingScript.variable} ${fredoka.variable} ${playfair.variable} ${quicksand.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
