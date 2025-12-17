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

### 🚧 Week 1: Foundation (IN PROGRESS)
- [x] Database schema creation ✅ (PR #3 - Merged)
- [x] Authentication setup (email/password + Google OAuth) ✅ (PR #4 - Merged)
- [x] Protected routes middleware ✅
- [x] Basic UI layout (mobile + desktop) ✅ (PR #5 - Merged)
- [x] Group creation and management (Phase 1) ✅ (PR #5 - Merged)
- [ ] Add/view expenses (equal split only)
- [ ] Basic balance calculation

### 📋 Week 2: Core Features
- [ ] Expense list with filters
- [ ] Edit/delete expenses
- [ ] Expense categories
- [ ] Custom split types (exact amount, percentage, shares)
- [ ] Select specific members for splits
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

## Expense Split Types (Phased Implementation)

### Phase 1: Equal Split (Week 1) ✅ Planned
The simplest split method - divides expense equally among all group members.

**Example:** ₹300 expense with 3 members = ₹100 per person

**Features:**
- Automatic equal division
- All group members included by default
- Simple UI - just amount and description
- Perfect for shared household expenses

### Phase 2: Custom Splits (Week 2+)
Advanced split methods for complex expense scenarios.

#### 1. Exact Amount Split
Manually specify exact amount for each person.
- **Use case:** Unequal purchases (e.g., different items in a bill)
- **Example:** Total ₹300 → Person A: ₹150, Person B: ₹100, Person C: ₹50

#### 2. Percentage Split
Split by percentage distribution.
- **Use case:** Income-based splits, proportional contributions
- **Example:** Total ₹300 → Person A: 50% (₹150), Person B: 30% (₹90), Person C: 20% (₹60)

#### 3. Shares/Ratio Split
Split by ratio or shares.
- **Use case:** Different consumption levels
- **Example:** Total ₹300 → Person A: 2 shares (₹150), Person B: 1 share (₹75), Person C: 1 share (₹75)

#### 4. Select Specific Members
Choose which group members to include in split.
- **Use case:** Not everyone participated in the expense
- **Example:** Only 2 out of 5 group members went shopping

**Implementation Priority:**
1. Equal split (Week 1)
2. Exact amount + Member selection (Week 2)
3. Percentage + Shares (Week 2-3)

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

## Development Progress Log

### December 15, 2024 - Session 1: Project Setup
**✅ Completed:**
- Project initialized with Next.js 15, TypeScript, Tailwind CSS
- Supabase account created (Project: Split-Ease)
- GitHub repository created: https://github.com/Shasha0072/split-ease
- Git workflow established (main → development → feature branches)
- Environment variables configured
- Development server running successfully

**📝 Decisions Made:**
- Using Git Flow branching strategy
- Feature branches with Pull Requests for all changes
- Commit message convention: `<type>: <description>`
- Building incrementally, one feature at a time

### December 15, 2024 - Session 2: Database Schema (PR #3)
**✅ Completed:**
- Created complete database schema with 13 tables
- Implemented Row Level Security (RLS) policies
- Added performance indexes
- Created TypeScript type definitions
- Documentation: `supabase/README.md`

**📊 Tables Created:**
1. users - User profiles
2. groups - Expense groups
3. group_members - User-group relationships
4. expenses - Expense tracking
5. expense_splits - Split calculations
6. settlements - Payment records
7. expense_history - Audit trail
8. activity_feed - Real-time activity
9. notifications - User notifications
10. group_invites - Invite system
11. user_preferences - User settings
12. monthly_expense_summary - Analytics
13. balance_snapshots - Balance tracking

**🔗 Pull Request:** #3 (Merged to development)

### December 15, 2024 - Session 3: Authentication System (PR #4)
**✅ Completed:**
- Email/password authentication
- Google OAuth integration (code ready, needs config)
- Login, Signup, Password Reset pages
- Protected dashboard placeholder
- Server actions for auth operations
- OAuth callback handler
- Documentation: `docs/GOOGLE_OAUTH_SETUP.md`

**📄 Pages Created:**
- `/` - Landing page with auth links
- `/login` - Sign in page
- `/signup` - Create account page
- `/reset-password` - Request password reset
- `/reset-password/confirm` - Set new password
- `/dashboard` - Protected dashboard (placeholder)

**🔐 Server Actions:**
- `login()` - Email/password sign in
- `signup()` - User registration
- `signOut()` - Sign out
- `resetPassword()` - Send reset email
- `updatePassword()` - Update password
- `signInWithGoogle()` - Google OAuth

**🔗 Pull Request:** #4 (Merged to development)

**📝 Notes:**
- Google OAuth requires configuration in Supabase dashboard
- See `docs/GOOGLE_OAUTH_SETUP.md` for setup guide
- Server running on http://localhost:3003

### December 16, 2024 - Session 4: UI Components & Group Management (PR #5)
**✅ Completed:**
- Created complete UI component library
- Built responsive layouts (desktop + mobile)
- Implemented Group Management Phase 1
- Fixed RLS policies for group operations
- Tested group creation and listing

**🎨 UI Components Created:**
- Button, Card, Input, Alert, Badge, Avatar
- AuthLayout, DashboardLayout, MobileLayout
- Improved landing page with gradients
- Enhanced dashboard with proper layouts

**👥 Group Management Features:**
- Create groups (household/trip/event types)
- List all user's groups
- Server actions for CRUD operations
- Automatic user record creation
- Activity feed integration

**📄 Pages Created:**
- `/groups` - List all groups (grid/card layout)
- `/groups/new` - Create new group form
- Enhanced `/dashboard` with mobile/desktop layouts

**🔧 Server Actions:**
- `createGroup()` - Create group and add creator as admin
- `getGroups()` - Fetch all user's groups
- `getGroup()` - Fetch single group details
- `updateGroup()` - Update group (admin only)
- `archiveGroup()` - Archive group (admin only)

**🐛 Fixes Applied:**
- Fixed infinite recursion in `group_members` RLS policies
- Fixed `groups` RLS policies for proper access control
- Resolved foreign key constraint issues
- Added user upsert to ensure user exists before operations

**📊 Database Migrations:**
- `20241216000000_fix_rls_recursion.sql`
- `20241216000001_fix_rls_properly.sql`
- `20241216000002_fix_groups_rls.sql`

**🔗 Pull Request:** #5 (Merged to development)

**📝 Notes:**
- Group creation tested and working
- Mobile responsive layouts verified
- RLS policies properly configured
- Ready for expense management next

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

---

## Quick Stats

**Project Status:** 🚧 In Active Development
**Current Branch:** `development`
**Total PRs Merged:** 5
**Week 1 Progress:** 5/7 tasks completed (71%)
**Last Updated:** December 16, 2024
