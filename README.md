# Glow - Nature-Inspired Website with Next.js

This is a comprehensive **Glow website** built with [Next.js](https://nextjs.org) and enhanced with a complete **nature-inspired color strategy**. The project demonstrates a modern e-commerce skincare website with product categorization, color-coded UI elements, and a seamless design system.

## 🎨 **Nature-Inspired Color Strategy**

The website implements a **clean, airy, and modern** aesthetic that feels:
- **Scientifically credible** with professional color choices
- **Emotionally inviting & feminine** through nature-inspired palettes  
- **Product-category distinct** with unique accent colors per SKU
- **Packaging consistent** for seamless online-to-offline experience

### Global Brand Colors
- **Soft Sand Beige** (`#F4EDE4`) - Premium backgrounds
- **Off White** (`#FAFAFA`) - Clean, breathable base
- **Charcoal Grey** (`#2E2E2E`) - Primary typography
- **Turmeric Gold** (`#E6A600`) - Primary CTAs and actions
- **Misty Blue** (`#A8C6D7`) - Soft highlights and dividers

### Product Category System
Each skincare category has its own accent color:
- **Cleanser** → Botanical Green (`#4A7C59`)
- **Hydrating Serums** → Misty Blue (`#A8C6D7`)
- **Brightening Serums** → Turmeric Gold (`#E6A600`)
- **Sunscreen** → Citrus Yellow (`#FFD45A`)
- **Acne Control** → Earth Clay (`#B86B4B`)
- **Anti-Aging** → Deep Plum (`#5A3A55`)
- **Soothing Care** → Lotus Pink (`#F3A6B5`)

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Properties
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Development**: Turbopack for fast development builds

## 🛠️ Features

### ✅ **Complete Website Implementation**
- Navigation with category-specific accent colors
- Hero section with nature-inspired gradients
- Product cards with dynamic color theming
- Category pages with filtered product views
- Product detail pages with accent-based CTAs
- Education/blog section with topic-specific colors
- Footer with brand-consistent styling

### ✅ **Dynamic Color System**
- CSS custom properties for product categories
- React components with TypeScript color integration
- Hover states and smooth transitions
- Accessibility-compliant contrast ratios
- Responsive design adaptations

### ✅ **Modern Development Practices**
- TypeScript for type safety
- Component-based architecture
- Custom hooks for state management
- Framer Motion animations
- ESLint and code quality tools

## 🎯 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000) to see the Glow website.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Homepage with Glow demo
│   └── globals.css             # Global styles with color system
├── components/
│   ├── ui/                     # Shadcn UI components
│   ├── glow-home.tsx   # Main website demo component
│   └── website-layouts.tsx     # Navigation, footer, page layouts
├── lib/
│   ├── features/
│   │   └── counterSlice.ts     # Redux slice example
│   ├── hooks.ts                # Typed Redux hooks
│   ├── providers.tsx           # React Query and Redux providers
│   ├── store.ts                # Redux store configuration
│   └── utils.ts                # Utility functions
└── styles/
    └── colors.ts               # Complete color system definition
```

## 🎨 **Color Strategy Documentation**

See [`TSO_SKINCARE_COLOR_STRATEGY.md`](./TSO_SKINCARE_COLOR_STRATEGY.md) for comprehensive documentation including:
- Complete color palette definitions
- Page-specific implementation guidelines
- CSS custom properties usage
- Component integration examples
- Accessibility compliance details
- Responsive design considerations

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌟 **Website Sections Implemented**

### **Homepage**
- Hero with nature-inspired gradient background
- Category showcase with product-specific colors
- Featured products grid with hover animations
- Trust indicators with branded iconography
- Educational blog preview section

### **Product System**
- Dynamic product cards with category-based styling
- Color-coded badges and CTAs
- Smooth hover transitions and micro-interactions
- Rating displays and benefit highlights

### **Color Palette Showcase**
- Visual documentation of the complete color system
- Interactive color swatches with hex values
- Brand foundation and product category demonstrations

## 📚 Learn More

### Technologies Used:
- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TanStack Query](https://tanstack.com/query)
- [Shadcn UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

### Design Inspiration:
- Nature-inspired color palettes
- Clean e-commerce aesthetics  
- Skincare industry best practices
- Accessibility-first design principles

## 🚢 Deploy on Vercel

The easiest way to deploy this Glow website is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

---

**This project demonstrates a complete implementation of a modern skincare e-commerce website with a sophisticated nature-inspired color strategy, built with cutting-edge web technologies.**
