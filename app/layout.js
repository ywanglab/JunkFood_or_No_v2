import './globals.css';

export const metadata = {
  title: 'Junk or No?',
  description: 'A beginner-friendly food checker that identifies junk food.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
