import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ReactNode } from 'react';

export const metadata = {
  title: 'AI Fitness Coach',
  description: 'AI-powered platform delivering personalized diet and workout plans.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}