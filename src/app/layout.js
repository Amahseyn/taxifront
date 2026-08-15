import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Colchester Airport Taxi',
  description: '24/7 Airport taxi service based in Colchester.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/font-awesome.min.css" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

