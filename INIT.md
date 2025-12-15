# SplitEase - Initialization & Setup Documentation

## Project Information
- **Project Name:** SplitEase
- **Start Date:** December 15, 2024
- **Developer:** Shashwat Adhau
- **Goal:** Learn web development while building a flatmate expense splitting app

---

## Supabase Setup
- **Project Name:** Split-Ease
- **Status:** ✅ Account created and project initialized
- **Project Reference:** dvbmtcwvnhnrsgtpseku
- **Dashboard:** https://supabase.com/dashboard/project/dvbmtcwvnhnrsgtpseku

### Credentials Configuration ✅
```bash
# Configured in .env.local (not committed to Git)
NEXT_PUBLIC_SUPABASE_URL=https://dvbmtcwvnhnrsgtpseku.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (KEEP SECRET!)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Deployment:** Vercel (TBD)
- **Package Manager:** npm

---

## Project Structure (Planned)
```
split-ease/
├── .env.local                    # Environment variables (not committed)
├── .gitignore                   # Git ignore file
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind configuration
├── README.md                    # Project README
├── INIT.md                      # This file
├── flatmate-expense-app-brief.md # Project brief
├── app/                         # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── (auth)/                 # Auth routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── (protected)/            # Protected routes
│   │   ├── dashboard/
│   │   ├── groups/
│   │   ├── expenses/
│   │   └── settings/
│   └── api/                    # API routes
│       ├── auth/
│       ├── groups/
│       └── expenses/
├── components/                  # React components
│   ├── ui/                     # Shared UI components
│   ├── layout/                 # Layout components
│   └── features/               # Feature-specific components
├── lib/                        # Utilities
│   ├── supabase/              # Supabase client & helpers
│   ├── utils/                 # Helper functions
│   └── types/                 # TypeScript types
├── public/                     # Static assets
└── supabase/                   # Supabase migrations & config
    └── migrations/
```

---

## Development Phases

### ✅ Phase 0: Initial Setup (COMPLETED)
- [x] Create Supabase account
- [x] Create Supabase project
- [x] Create INIT.md documentation
- [x] Initialize Next.js 15 project with TypeScript
- [x] Install dependencies (Supabase, React Query, React Hook Form, Zod)
- [x] Configure environment variables (.env.local)
- [x] Set up Tailwind CSS
- [x] Create basic folder structure
- [x] Set up Supabase client (browser, server, middleware)
- [x] Configure authentication middleware
- [x] Create landing page

### 📋 Week 1: Foundation
- [ ] Database schema creation
- [ ] Authentication setup (email/password + Google OAuth)
- [ ] Protected routes middleware
- [ ] Basic UI layout (mobile + desktop)
- [ ] Group creation and management
- [ ] Add/view expenses (equal split only)
- [ ] Basic balance calculation

### 📋 Week 2: Core Features
- [ ] Expense list with filters
- [ ] Edit/delete expenses
- [ ] Expense categories
- [ ] Settlement flow
- [ ] Balance display on dashboard
- [ ] Recent activity feed
- [ ] In-app notifications

### 📋 Week 3: Enhancements
- [ ] Email notifications
- [ ] WhatsApp share functionality
- [ ] Settlement history
- [ ] Activity feed with filters
- [ ] Invite system
- [ ] User preferences

### 📋 Week 4: Analytics & Polish
- [ ] Personal analytics dashboard
- [ ] Group analytics
- [ ] Charts (spending trends, category breakdown)
- [ ] Archive groups
- [ ] Desktop dashboard optimization
- [ ] Mobile responsive refinements

---

## Git Setup ✅

### Repository Information
- **GitHub Repository:** https://github.com/Shasha0072/split-ease
- **Main Branch:** `main` (production-ready code)
- **Development Branch:** `development` (active development)

### Branching Strategy

We follow a **Git Flow** approach:

1. **`main` branch** - Production-ready, stable code
   - Protected branch
   - Only accepts PRs from `development` or hotfix branches
   - Each merge represents a release

2. **`development` branch** - Active development
   - Base branch for all feature branches
   - Integration branch for testing features together

3. **Feature branches** - Individual features/fixes
   - Format: `feature/feature-name` or `fix/bug-name`
   - Branch from: `development`
   - Merge into: `development` via Pull Request

### Workflow for Each Feature

```bash
# 1. Make sure you're on development and up to date
git checkout development
git pull origin development

# 2. Create a new feature branch
git checkout -b feature/database-schema
# OR for fixes: git checkout -b fix/auth-bug

# 3. Work on your feature, make commits
git add .
git commit -m "Add users table schema"

# 4. Push feature branch to GitHub
git push -u origin feature/database-schema

# 5. Create Pull Request on GitHub
# Go to: https://github.com/Shasha0072/split-ease/pulls
# Click "New Pull Request"
# Base: development <- Compare: feature/database-schema
# Add description, review changes, create PR

# 6. After PR is approved and merged, delete feature branch
git checkout development
git pull origin development
git branch -d feature/database-schema

# 7. Start next feature (repeat from step 2)
```

### Commit Message Convention

Format: `<type>: <description>`

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add user authentication with Supabase"
git commit -m "fix: resolve balance calculation error"
git commit -m "docs: update API documentation"
```

### Current Setup Status
- [x] Repository created on GitHub
- [x] Initial commit pushed to `main`
- [x] `development` branch created and pushed
- [x] Currently on `development` branch
- [ ] Branch protection rules (optional, for later)

---

## Quick Start Commands (After Setup)
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

---

## Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

---

## Notes & Decisions Log

### December 15, 2024
- Project initialized
- Supabase account created
- Project name: Split-Ease
- Starting with Week 1 foundation features
- Will build incrementally, one feature at a time for learning

---

## Environment Variables Checklist
- [x] NEXT_PUBLIC_SUPABASE_URL
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [x] SUPABASE_SERVICE_ROLE_KEY
- [x] NEXT_PUBLIC_APP_URL (for local dev)

---

## Future Considerations
- [x] Set up GitHub repository
- [ ] Set up branch protection rules for `main`
- [ ] Configure Vercel deployment
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics (optional)
- [ ] Set up automated backups
- [ ] Add GitHub Actions for CI/CD

---

**Last Updated:** December 15, 2024
