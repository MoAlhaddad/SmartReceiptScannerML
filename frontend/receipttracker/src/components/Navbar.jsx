'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar({ sticky = true }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className={`bg-background border-b border-gray-200 dark:border-zinc-800 z-50 ${
        sticky ? 'sticky top-0' : 'relative'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <Link href="/" className="text-xl font-bold text-foreground">
          🧾 SmartReceipt
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-sm">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/results">Check Your Taxes</NavLink>
          <NavLink href="#about">About</NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <NavLink href="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink href="/results" onClick={() => setMenuOpen(false)}>
            Check Your Taxes
          </NavLink>
          <NavLink href="#about" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-foreground hover:text-blue-500 transition"
    >
      {children}
    </Link>
  )
}
