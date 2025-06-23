import './globals.css';

export const metadata = {
  title: 'Bank Statement OCR & Tax Calculator',
  description: 'Upload bank statements, extract transactions, and calculate taxes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-50 min-h-screen text-gray-900 font-sans">
        <header className="bg-white shadow-md p-4 mb-8">
          <nav className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">
              Bank OCR & Tax
            </h1>
            <div className="space-x-6 text-lg font-medium text-blue-600">
              <a
                href="/"
                className="hover:text-blue-800 transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/results"
                className="hover:text-blue-800 transition-colors duration-200"
              >
                Results
              </a>
            </div>
          </nav>
        </header>

        <main className="min-h-[70vh]">{children}</main>

        <footer className="text-center p-6 mt-16 text-gray-500 text-sm select-none">
          &copy; 2025 Bank OCR & Tax App
        </footer>
      </body>
    </html>
  );
}
