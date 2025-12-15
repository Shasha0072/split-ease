# SplitEase - Flatmate Expense Splitting App

A modern web application for tracking and splitting expenses with flatmates, built with Next.js, TypeScript, and Supabase.

## 🚀 Features (Planned)

- **User Authentication** - Email/password and Google OAuth
- **Group Management** - Create and manage household, trip, or event groups
- **Expense Tracking** - Add, edit, and categorize expenses
- **Smart Splitting** - Equal, custom, percentage, and share-based splits
- **Settlement System** - Track balances and record payments
- **Real-time Updates** - Live sync across all devices
- **Analytics** - Insights into spending patterns
- **Mobile-First Design** - Optimized for mobile with desktop enhancements

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **State Management:** React Query
- **Forms:** React Hook Form + Zod
- **Deployment:** Vercel (planned)

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd split-ease
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
split-ease/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── (auth)/              # Authentication routes
│   ├── (protected)/         # Protected routes
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Layout components
│   └── features/            # Feature-specific components
├── lib/                     # Utilities and configurations
│   ├── supabase/           # Supabase client setup
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
└── public/                  # Static assets
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📖 Documentation

- [Project Brief](./flatmate-expense-app-brief.md) - Comprehensive project documentation
- [Initialization Guide](./INIT.md) - Setup and progress tracker

## 🎯 Development Roadmap

### Phase 0: Initial Setup ✅
- Next.js project initialization
- Supabase configuration
- Basic project structure

### Week 1: Foundation (Current)
- Database schema creation
- Authentication implementation
- Group management
- Basic expense tracking

### Week 2: Core Features
- Expense management
- Settlement system
- Dashboard implementation

### Week 3: Enhancements
- Notifications
- Activity feed
- User preferences

### Week 4: Analytics & Polish
- Analytics dashboard
- Performance optimization
- UI refinements

## 👨‍💻 Developer

**Shashwat Adhau**

This project is being built as a learning experience to understand modern web development with Next.js, TypeScript, and Supabase.

## 📄 License

This is a personal learning project.

## 🙏 Acknowledgments

- Next.js documentation and team
- Supabase documentation and community
- Tailwind CSS
