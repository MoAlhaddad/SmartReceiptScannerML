'use client'

import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="pt-12 max-w-6xl mx-auto px-4 py-10 space-y-10">
  
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
