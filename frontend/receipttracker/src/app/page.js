'use client'

import Layout from '@/components/Layout'
import UploadBankStatement from '@/components/UploadBankStatement'

export default function Home() {
  return (
    <Layout stickyNavbar={false}>
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to SmartReceipt
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Upload your bank statement or receipt image. We'll scan it and extract deductible transactions to help estimate your taxes.
        </p>
      </section>

      {/* Upload Component */}
      <UploadBankStatement />
    </Layout>
  )
}
