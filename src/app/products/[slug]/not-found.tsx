'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/website-layouts'
import { ArrowLeft, Search, Home } from 'lucide-react'
import { colors } from '@/styles/colors'
import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 rounded-3xl"
          >
            {/* 404 Animation */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
            </motion.div>

            <h1 className="text-3xl font-bold mb-4" style={{ color: colors.text.primary }}>
              Product Not Found
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We couldn't find the product you're looking for. It might have been removed, 
              renamed, or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products">
                <Button 
                  className="flex items-center gap-2 text-white"
                  style={{ backgroundColor: colors.brand.goldenDawn }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Products
                </Button>
              </Link>
              
              <Link href="/products">
                <Button variant="outline" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Products
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </Link>
            </div>

            {/* Suggested Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-6 bg-gray-50 rounded-xl"
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                What you can do:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Check the URL for any typos</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Browse our product categories</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use the search function</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Contact our support team</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}