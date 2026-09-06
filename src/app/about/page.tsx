"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigation, Footer } from "@/components/website-layouts";
import { Leaf, Heart, Globe, Users, Award, Sparkles } from "lucide-react";
import { colors } from "@/styles/colors";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.brand.mistWhite }}
    >
      <Navigation />

      {/* Hero Section */}
      <section
        className="py-20 px-4"
        style={{
          background: `linear-gradient(135deg, ${colors.brand.sandyBeige} 0%, ${colors.brand.mistWhite} 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1
              className="text-5xl font-bold mb-6"
              style={{ color: colors.text.primary }}
            >
              About Glow
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Born from a passion for natural beauty and sustainable skincare,
              Glow combines traditional botanicals with modern science to create
              products that nurture both your skin and the planet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: colors.text.primary }}
              >
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2020, Glow emerged from a simple belief: that
                  effective skincare shouldn't come at the cost of our planet's
                  wellbeing. Our founder, inspired by traditional Ayurvedic
                  practices and modern dermatological research, set out to
                  create a brand that honors both ancient wisdom and scientific
                  innovation.
                </p>
                <p>
                  Every product in our collection is carefully formulated with
                  sustainably sourced botanicals, targeting the unique needs of
                  modern skin while maintaining our commitment to environmental
                  responsibility.
                </p>
                <p>
                  Today, Glow is trusted by thousands of customers who share our
                  vision of clean, effective, and consciously crafted skincare.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div
                className="aspect-square rounded-lg shadow-2xl flex items-center justify-center text-6xl font-bold text-white"
                style={{ backgroundColor: colors.products.cleanser.primary }}
              >
                Glow
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: colors.brand.sandyBeige }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from product
              development to customer care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Leaf,
                title: "Natural & Clean",
                description:
                  "We believe in the power of nature. Our products are formulated with carefully selected botanical ingredients, free from harmful chemicals.",
                color: colors.products.cleanser.primary,
              },
              {
                icon: Globe,
                title: "Sustainable",
                description:
                  "Environmental responsibility is at our core. From sourcing to packaging, we prioritize sustainable practices that protect our planet.",
                color: colors.products.serum.primary,
              },
              {
                icon: Heart,
                title: "Inclusive Beauty",
                description:
                  "Beautiful skin comes in all forms. Our products are designed to celebrate and enhance your natural beauty, regardless of skin type or tone.",
                color: colors.products.moisturizer.primary,
              },
              {
                icon: Users,
                title: "Community First",
                description:
                  "Our customers are our family. We listen, learn, and grow together, building products that truly serve your skincare needs.",
                color: colors.brand.goldenDawn,
              },
              {
                icon: Award,
                title: "Quality Excellence",
                description:
                  "We never compromise on quality. Every product undergoes rigorous testing to ensure safety, efficacy, and the highest standards.",
                color: colors.products.treatment.primary,
              },
              {
                icon: Sparkles,
                title: "Innovation",
                description:
                  "We continuously explore new ingredients and formulations, blending traditional wisdom with cutting-edge skincare science.",
                color: colors.products.sunscreen.primary,
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${value.color}15` }}
                    >
                      <value.icon
                        className="h-8 w-8"
                        style={{ color: value.color }}
                      />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div
                className="aspect-square rounded-lg shadow-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.products.cleanser.primary} 0%, ${colors.products.serum.primary} 100%)`,
                }}
              >
                <div className="text-center text-white">
                  <Leaf className="h-20 w-20 mx-auto mb-4" />
                  <p className="text-xl font-semibold">100% Natural</p>
                  <p className="text-sm opacity-90">Ingredients</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: colors.text.primary }}
              >
                Our Commitment to You
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  At Glow, we promise to deliver products that are not only
                  effective but also safe, sustainable, and thoughtfully
                  crafted. We believe that great skincare should enhance your
                  natural beauty while respecting the environment.
                </p>
                <p>
                  Our commitment extends beyond our products. We're dedicated to
                  transparency in our ingredient sourcing, ethical business
                  practices, and supporting communities that help us bring you
                  the finest natural ingredients.
                </p>
                <p>
                  Every purchase you make supports our mission to create a more
                  sustainable and beautiful world, one skincare routine at a
                  time.
                </p>
              </div>

              <div className="mt-8">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="text-white font-medium"
                    style={{ backgroundColor: colors.brand.goldenDawn }}
                  >
                    Explore Our Products
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: colors.brand.sandyBeige }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Our Impact
            </h2>
            <p className="text-lg text-gray-600">
              Together, we're making a difference in the world of skincare.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "100%", label: "Natural Ingredients" },
              { number: "15+", label: "Premium Products" },
              { number: "4.8", label: "Average Rating" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: colors.brand.goldenDawn }}
                >
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
