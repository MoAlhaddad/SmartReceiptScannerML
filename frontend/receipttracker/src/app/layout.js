import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SmartReceipt Scanner',
  description: 'AI-powered tax deduction estimator from your receipts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        {/* Pass sticky=true or false here */}
        <Navbar sticky={false} />
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {children}
        </main>
      </body>
    </html>
  )
}
