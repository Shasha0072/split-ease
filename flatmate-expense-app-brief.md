# Flatmate Expense Splitting App - Project Brief

## 📋 Project Overview

**Project Name:** SplitEase (Working Title)  
**Type:** Web Application (Mobile-First, Desktop-Optimized)  
**Purpose:** Expense tracking and settlement management for flatmates and small groups  
**Target Users:** Flatmates, roommates, small friend groups (3-10 people)  
**Primary Use Cases:**
- Household expense management (rent, groceries, utilities)
- Trip expense tracking (vacations, weekend getaways)
- Event expense splitting (parties, group dinners)

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (optional) or custom components
- **Charts:** Recharts or Chart.js
- **State Management:** React Context + React Query for server state
- **Forms:** React Hook Form + Zod validation

### Backend
- **API:** Next.js API Routes (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (for receipt uploads)
- **Real-time:** Supabase Realtime subscriptions

### Deployment
- **Frontend/API:** Vercel
- **Database/Auth:** Supabase Cloud
- **Domain:** TBD

### Development Tools
- **Package Manager:** npm or pnpm
- **Linting:** ESLint + Prettier
- **Git:** GitHub repository
- **Environment:** .env.local for local development

---

## 🎨 Design Philosophy

### Mobile-First Approach
- Primary interface optimized for mobile devices
- Touch-friendly UI elements
- Bottom navigation for easy thumb access
- Swipe gestures for common actions
- Camera integration for receipt scanning

### Desktop Experience
- Enhanced analytics and reporting capabilities
- Multi-column layouts for efficiency
- Keyboard shortcuts for power users
- Side-by-side group comparisons
- Advanced filtering and bulk operations

### UI/UX Principles
- Clean, minimal interface
- Clear visual hierarchy
- Instant feedback on actions
- Optimistic UI updates
- Progressive disclosure (show complexity only when needed)
- Color coding: Green (owed to you), Red (you owe), Gray (settled)

---

## 🔐 Authentication & User Management

### Authentication Flow

#### Sign Up
1. User lands on landing page
2. Click "Get Started" or "Sign Up"
3. Choose authentication method:
   - **Email/Password:** Collect name, email, phone, password
   - **Google OAuth:** One-click signup (recommended)
4. Email verification sent (if email/password)
5. Optional onboarding flow:
   - Create first group OR join existing group via invite
   - Add initial flatmates
6. Redirect to dashboard

#### Login
1. Email/Password login
2. OR Google OAuth
3. "Remember me" checkbox
4. "Forgot password?" link
5. Auto-redirect to dashboard if session exists

#### Password Reset
1. Enter email
2. Receive reset link
3. Set new password
4. Redirect to login

### User Profile
- Name (required)
- Email (required, unique)
- Phone number (required for WhatsApp integration)
- WhatsApp number (optional, defaults to phone)
- Profile picture (optional)
- Default currency (future: INR for MVP)
- Notification preferences

### Invite System
- Generate unique invite codes per group
- Invite link format: `https://app.com/invite/{CODE}`
- Invite methods:
  - Copy link
  - WhatsApp share (pre-filled message)
  - Email invite
  - QR code (for in-person)
- Invite expiry: 7 days (configurable)
- Max uses: Unlimited (or set per invite)

---

## 👥 Group Management

### Group Types
1. **Household:** Long-term living arrangements (e.g., "Flat 402")
2. **Trip:** One-time or temporary events (e.g., "Goa Trip 2024")
3. **Event:** Specific occasions (e.g., "Birthday Party")

### Group Features
- **Create Group:**
  - Name (required)
  - Type (household/trip/event)
  - Description (optional)
  - Add initial members
  - Link WhatsApp group (optional)

- **Group Settings:**
  - Edit name/description
  - Add/remove members
  - Set member roles (admin/member)
  - Default split method
  - Archive/unarchive group
  - Delete group (admin only, with confirmation)

- **Group Dashboard:**
  - Total group spending
  - Per-person balances
  - Recent expenses
  - Settlement suggestions
  - Category breakdown

### Group Permissions
- **Admin:**
  - Add/remove members
  - Edit group settings
  - Delete any expense
  - Archive/delete group
  
- **Member:**
  - Add expenses
  - Edit own expenses
  - View all group data
  - Settle debts

---

## 💰 Expense Management

### Add Expense Flow
1. Click "Add Expense" button (FAB on mobile)
2. Fill expense form:
   - **Amount:** Decimal number (required)
   - **Description:** Short text (required)
   - **Category:** Dropdown selection (required)
   - **Paid by:** Select member (default: current user)
   - **Date:** Date picker (default: today)
   - **Split among:** Multi-select checkboxes (default: all members)
   - **Split type:** Equal / Custom / Percentage / Shares
   - **Receipt:** Optional image upload
3. Review split breakdown
4. Submit → Optimistic UI update → Real-time sync

### Split Types

#### Equal Split (Default)
- Amount divided equally among selected members
- Example: ₹600 / 3 people = ₹200 each

#### Custom Amounts
- Manually specify amount for each person
- Must sum to total amount
- Example: John ₹300, You ₹200, Raj ₹100

#### Percentage Split
- Specify percentage for each person
- Must sum to 100%
- Example: You 60%, John 40%

#### Shares Split
- Specify ratio/shares
- Example: 2:1:1 → ₹600 = ₹300, ₹150, ₹150

### Categories
- Groceries
- Utilities (electricity, water, gas)
- Rent
- Internet/Phone
- Cleaning Supplies
- Food Delivery
- Entertainment
- Transportation
- Medical
- Other (with custom label)

### Expense Actions
- **View:** See full details, split breakdown, receipt
- **Edit:** Modify any field (only creator or admin)
  - Track changes in history
  - Notify affected members
- **Delete:** Soft delete with confirmation (only creator or admin)
  - Keep in history as deleted
- **Duplicate:** Create copy with same details
- **Mark as Settled:** Quick action for simple splits

### Recurring Expenses
- Set frequency: Daily, Weekly, Monthly, Yearly
- Specify:
  - Start date
  - End date (optional, or "never")
  - Day of week/month
  - Auto-create on due date
- Notification when auto-created
- Edit/pause/resume recurring rule
- Examples: Rent (1st of month), Internet (15th of month)

### Receipt Management
- Upload image (JPG, PNG, PDF)
- Store in Supabase Storage
- Display thumbnail in expense list
- Full-screen view with zoom
- Optional OCR for amount extraction (future)
- Delete receipt (only creator/admin)

---

## 💸 Settlement System

### Balance Calculation
- Per-group balance calculation
- Track: Who owes whom and how much
- Support partial settlements
- Net balance: Positive (owed to you), Negative (you owe)

### Settlement Flow
1. Navigate to "Settle Up" from dashboard
2. View balance summary:
   - People you owe (red)
   - People who owe you (green)
3. Select person to settle with
4. Choose settlement amount:
   - Full settlement (entire balance)
   - Partial settlement (custom amount)
5. Record payment details:
   - Payment method: UPI, Cash, Bank Transfer, Other
   - Reference ID (e.g., UPI transaction ID)
   - Note (optional)
6. Confirm settlement
7. Update balances
8. Notify other person

### Settlement Optimization
- Algorithm to minimize number of transactions
- Example simplification:
  - Before: A owes B ₹100, B owes C ₹100, C owes A ₹100
  - After: No transactions needed (circular debt)
- Display optimized settlement suggestions

### Settlement History
- Timeline view of all settlements
- Filter by: Person, Date range, Payment method
- Details: Amount, date, method, reference, note
- Export settlement history

---

## 📊 Dashboard

### Mobile Dashboard (Primary View)

#### Top Section
- **Balance Summary Card:**
  - Total you owe (large red number)
  - Total you're owed (large green number)
  - Net position (bold)

#### Quick Stats
- This month's total expenses
- Your share this month
- Number of unsettled expenses
- Active groups count

#### Settlement Suggestions
- Card showing who to pay/receive from
- "Pay John ₹450" button
- "Receive ₹200 from Raj" (send reminder option)

#### Recent Activity
- Last 5-7 expenses
- Compact card view:
  - Description, amount, paid by, date
  - Tap to view details

#### Upcoming/Recurring
- Rent due in 3 days
- Internet bill tomorrow
- Snooze/mark as paid

### Desktop Dashboard (Enhanced)

#### Sidebar Navigation
- Dashboard (active)
- All Expenses
- Groups
- Analytics
- Settlements
- Profile/Settings

#### Main Content Area
- **Top Row:**
  - Balance summary (3 cards: owe, owed, net)
  - Quick actions (Add Expense, Settle Up)

- **Middle Row:**
  - Recent activity (left 60%)
  - Settlement suggestions (right 40%)

- **Bottom Row:**
  - Monthly spending chart
  - Category breakdown pie chart

#### Group Selector
- Dropdown or tabs to switch active group
- Show "All Groups" for combined view

---

## 📈 Analytics & History

### Individual Analytics

#### Overview Page
- **Time Selector:** Last 7 days, This month, Last month, This year, Custom range
- **Key Metrics Cards:**
  - Total spent this period
  - Average per expense
  - Most expensive expense
  - Most common category

#### Monthly Trend
- Line chart showing spending over last 6 months
- Hover to see exact amount
- Compare with previous period

#### Category Breakdown
- Pie chart or bar chart
- Show percentage and amount
- Tap category to see all expenses in that category

#### Top Expenses
- List of highest expenses this period
- Sortable by amount, date
- Filter by category

#### Insights
- "You spent 15% more than last month"
- "Groceries increased by ₹500"
- "You've settled all outstanding balances ✓"

### Group Analytics

#### Group Overview
- Total group spending over time
- Per-person contribution comparison (bar chart)
- Category-wise breakdown
- Settlement efficiency (% settled vs outstanding)

#### Per-Member View
- Each member's contribution
- Who pays most often
- Who owes most currently
- Settlement history per member

#### Trip/Event Summary
- Total cost
- Per-person cost
- Itemized breakdown by category
- Export as PDF report

### History & Audit Trail

#### Expense History
- Every change tracked:
  - Created by whom, when
  - Updated: what changed, by whom, when
  - Deleted: by whom, when, with reason
- Display as timeline
- Filter by action type, user, date

#### Settlement History
- Chronological list of all payments
- Filter by: Person, Method, Date range
- Details: Amount, from/to, method, reference, note

#### Activity Feed
- Real-time feed of all group activity:
  - "Shashwat added ₹500 for Groceries"
  - "John settled ₹1500 with you"
  - "Raj joined the group"
  - "Rent expense auto-created"
- Pagination (load more)
- Filter by activity type

#### Balance Snapshots
- Track daily balance for trend analysis
- Chart showing "Your balance with John over time"
- Identify debt accumulation patterns

### Export & Reporting

#### Export Options
- **CSV Export:**
  - All expenses for date range
  - Columns: Date, Description, Amount, Paid By, Category, Split Among, Your Share
  
- **PDF Report:**
  - Trip/event summary report
  - Include: Total, breakdown, analytics charts
  - Professional formatting
  
- **Settlement Report:**
  - Who paid whom, when, how much
  - Outstanding balances
  
#### Filters
- Date range
- Group
- Category
- Member
- Settled/Unsettled

---

## 🔔 Notifications

### Notification Types

#### Expense Notifications
1. **New Expense Added**
   - "Shashwat added ₹500 for Groceries"
   - Show your share
   - Link to expense details

2. **Expense Updated**
   - "John updated 'Internet Bill' amount to ₹1600"
   - Show what changed
   - Link to expense

3. **Expense Deleted**
   - "Raj deleted 'Old Expense'"
   - Show deleted details
   - Cannot be undone

4. **Recurring Expense Created**
   - "Rent expense auto-added for December"
   - Link to expense

#### Settlement Notifications
1. **Settlement Received**
   - "John settled ₹1500 with you"
   - Show payment method, reference
   - Link to settlement history

2. **Settlement Reminder**
   - "Gentle reminder: You owe John ₹2000"
   - Triggered after X days (configurable)
   - Link to settle up

3. **Settlement Request**
   - "Shashwat requested ₹450 settlement"
   - Quick action to mark as paid

#### Group Notifications
1. **New Member Joined**
   - "Raj joined 'Flat 402'"
   
2. **Invited to Group**
   - "Shashwat invited you to 'Goa Trip 2024'"
   - Accept/Decline buttons

3. **Group Settings Changed**
   - "Group name changed to 'Our New Flat'"

### Notification Channels

#### In-App Notifications
- Bell icon with unread badge
- Notification center/dropdown
- Mark as read/unread
- Mark all as read
- Delete notification
- Real-time via Supabase Realtime

#### Email Notifications
- Sent via Supabase email service
- Template-based (HTML emails)
- Configurable per notification type
- Daily digest option (single email with all updates)
- Unsubscribe link

#### WhatsApp Notifications (MVP: Phase 1)

**Phase 1: Manual Share (MVP)**
- Generate pre-formatted message
- User clicks → Opens WhatsApp → Sends to group
- Format:
  ```
  💰 New Expense Alert
  
  Shashwat added ₹500 for Groceries
  Your share: ₹167
  
  View details: [link]
  ```
- Share button on every expense
- Auto-suggest WhatsApp share after adding expense

**Phase 2: Automated Webhook**
- Integrate WhatsApp Business API or Twilio
- Auto-send to linked WhatsApp group
- Requires:
  - WhatsApp group webhook URL
  - API credentials
  - Business verification

**Phase 3: Conversational Bot (Future)**
- Full two-way communication
- Add expenses via chat: "Added groceries 500"
- Check balance: "/balance"
- Settle: "/settle John 1500"
- Natural language processing

### Notification Settings (Per User)
- Enable/disable globally
- Enable/disable per notification type
- Choose channels:
  - In-app (always on)
  - Email (on/off per type)
  - WhatsApp (on/off per type)
- Quiet hours (e.g., 10 PM - 8 AM)
- Digest mode: Daily summary instead of individual notifications
- Push notification settings (browser permission)

---

## 💾 Database Schema

### Tables

```typescript
// Users Table
users {
  id: uuid (PK, from Supabase Auth)
  email: text (unique, required)
  name: text (required)
  phone: text (required)
  whatsapp_number: text (nullable)
  avatar_url: text (nullable)
  default_currency: text (default: 'INR')
  created_at: timestamp
  updated_at: timestamp
}

// Groups Table
groups {
  id: uuid (PK)
  name: text (required)
  type: enum ('household', 'trip', 'event')
  description: text (nullable)
  created_by: uuid (FK users.id)
  whatsapp_group_link: text (nullable)
  whatsapp_webhook_url: text (nullable)
  is_archived: boolean (default: false)
  created_at: timestamp
  archived_at: timestamp (nullable)
}

// Group Members Table (Join table)
group_members {
  id: uuid (PK)
  group_id: uuid (FK groups.id)
  user_id: uuid (FK users.id)
  role: enum ('admin', 'member')
  joined_at: timestamp
  default_split_percentage: decimal (nullable)
  
  UNIQUE(group_id, user_id)
}

// Expenses Table
expenses {
  id: uuid (PK)
  group_id: uuid (FK groups.id)
  amount: decimal(10,2) (required)
  description: text (required)
  category: text (required)
  paid_by_user_id: uuid (FK users.id)
  date: date (required)
  created_by: uuid (FK users.id)
  created_at: timestamp
  updated_at: timestamp
  is_recurring: boolean (default: false)
  recurrence_rule: jsonb (nullable)
  receipt_url: text (nullable)
  is_deleted: boolean (default: false)
}

// Expense Splits Table
expense_splits {
  id: uuid (PK)
  expense_id: uuid (FK expenses.id)
  user_id: uuid (FK users.id)
  amount_owed: decimal(10,2) (required)
  amount_settled: decimal(10,2) (default: 0)
  is_fully_settled: boolean (default: false)
  
  UNIQUE(expense_id, user_id)
}

// Settlements Table
settlements {
  id: uuid (PK)
  group_id: uuid (FK groups.id)
  from_user_id: uuid (FK users.id) // Who paid
  to_user_id: uuid (FK users.id)   // Who received
  amount: decimal(10,2) (required)
  payment_method: enum ('upi', 'cash', 'bank_transfer', 'other')
  reference_id: text (nullable)
  note: text (nullable)
  settled_at: timestamp (required)
  created_at: timestamp
}

// Expense History Table (Audit Trail)
expense_history {
  id: uuid (PK)
  expense_id: uuid (FK expenses.id)
  action: enum ('created', 'updated', 'deleted')
  changed_by: uuid (FK users.id)
  old_values: jsonb (nullable)
  new_values: jsonb (nullable)
  changes_summary: text (nullable)
  changed_at: timestamp
}

// Activity Feed Table
activity_feed {
  id: uuid (PK)
  group_id: uuid (FK groups.id)
  user_id: uuid (FK users.id) // Who performed action
  action_type: enum (
    'expense_added', 'expense_updated', 'expense_deleted',
    'settlement_made', 'user_joined', 'user_left',
    'group_created', 'group_updated'
  )
  entity_id: uuid (nullable) // ID of related expense/settlement
  description: text (required)
  metadata: jsonb (nullable)
  created_at: timestamp
}

// Notifications Table
notifications {
  id: uuid (PK)
  user_id: uuid (FK users.id)
  group_id: uuid (FK groups.id, nullable)
  type: enum (
    'expense_added', 'expense_updated', 'expense_deleted',
    'settlement_received', 'settlement_reminder',
    'group_invite', 'member_joined'
  )
  title: text (required)
  content: text (required)
  link: text (nullable)
  is_read: boolean (default: false)
  sent_to_email: boolean (default: false)
  sent_to_whatsapp: boolean (default: false)
  email_sent_at: timestamp (nullable)
  whatsapp_sent_at: timestamp (nullable)
  created_at: timestamp
}

// Group Invites Table
group_invites {
  id: uuid (PK)
  group_id: uuid (FK groups.id)
  invite_code: text (unique, required)
  created_by: uuid (FK users.id)
  expires_at: timestamp (required)
  max_uses: integer (nullable)
  current_uses: integer (default: 0)
  is_active: boolean (default: true)
  created_at: timestamp
}

// User Preferences Table
user_preferences {
  id: uuid (PK)
  user_id: uuid (FK users.id, unique)
  email_notifications: boolean (default: true)
  whatsapp_notifications: boolean (default: true)
  push_notifications: boolean (default: true)
  notification_digest: boolean (default: false)
  quiet_hours_start: time (nullable)
  quiet_hours_end: time (nullable)
  notification_types: jsonb (which types to receive)
  created_at: timestamp
  updated_at: timestamp
}

// Aggregate Tables (for analytics performance)
monthly_expense_summary {
  id: uuid (PK)
  group_id: uuid (FK groups.id)
  user_id: uuid (FK users.id)
  month: date (first day of month)
  total_spent: decimal(10,2)
  total_share: decimal(10,2)
  net_contribution: decimal(10,2)
  expenses_count: integer
  settlements_made: decimal(10,2)
  settlements_received: decimal(10,2)
  category_breakdown: jsonb
  created_at: timestamp
  updated_at: timestamp
  
  UNIQUE(group_id, user_id, month)
}

balance_snapshots {
  id: uuid (PK)
  group_id: uuid (FK groups.id)
  user_id: uuid (FK users.id)
  other_user_id: uuid (FK users.id)
  balance: decimal(10,2) // Positive = owed to user, Negative = user owes
  snapshot_date: date
  created_at: timestamp
  
  UNIQUE(group_id, user_id, other_user_id, snapshot_date)
}
```

### Indexes
```sql
-- Expenses
CREATE INDEX idx_expenses_group_id ON expenses(group_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);

-- Expense Splits
CREATE INDEX idx_expense_splits_user_id ON expense_splits(user_id);
CREATE INDEX idx_expense_splits_expense_id ON expense_splits(expense_id);

-- Settlements
CREATE INDEX idx_settlements_group_id ON settlements(group_id);
CREATE INDEX idx_settlements_from_user ON settlements(from_user_id);
CREATE INDEX idx_settlements_to_user ON settlements(to_user_id);

-- Activity Feed
CREATE INDEX idx_activity_feed_group_id ON activity_feed(group_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

### Row Level Security (RLS) Policies

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can only see groups they're members of
CREATE POLICY "Users can view own groups"
  ON groups FOR SELECT
  USING (
    id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

-- Users can only see expenses in their groups
CREATE POLICY "Users can view group expenses"
  ON expenses FOR SELECT
  USING (
    group_id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    )
  );

-- Similar policies for all other tables
```

---

## 🔄 Real-time Features

### Supabase Realtime Subscriptions

```typescript
// Subscribe to new expenses in a group
supabase
  .channel('expenses')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'expenses',
      filter: `group_id=eq.${groupId}`
    },
    (payload) => {
      // Update UI with new expense
      addExpenseToList(payload.new)
    }
  )
  .subscribe()

// Subscribe to settlements
supabase
  .channel('settlements')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'settlements',
      filter: `to_user_id=eq.${userId}`
    },
    (payload) => {
      // Show notification
      showNotification('Payment received!')
    }
  )
  .subscribe()

// Subscribe to activity feed
supabase
  .channel(`activity:${groupId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'activity_feed',
      filter: `group_id=eq.${groupId}`
    },
    (payload) => {
      // Update activity feed
      addActivityItem(payload.new)
    }
  )
  .subscribe()
```

---

## 🚀 API Endpoints (Next.js App Router)

### Authentication
```
POST /api/auth/signup          - Create new user
POST /api/auth/login           - Login user
POST /api/auth/logout          - Logout user
POST /api/auth/reset-password  - Send reset email
POST /api/auth/update-password - Update password
GET  /api/auth/session         - Get current session
```

### Users
```
GET    /api/users/me           - Get current user profile
PATCH  /api/users/me           - Update profile
DELETE /api/users/me           - Delete account
GET    /api/users/:id          - Get user by ID (group members only)
```

### Groups
```
GET    /api/groups             - List all user's groups
POST   /api/groups             - Create new group
GET    /api/groups/:id         - Get group details
PATCH  /api/groups/:id         - Update group
DELETE /api/groups/:id         - Delete group
POST   /api/groups/:id/archive - Archive/unarchive group
```

### Group Members
```
GET    /api/groups/:id/members        - List group members
POST   /api/groups/:id/members        - Add member
DELETE /api/groups/:id/members/:uid   - Remove member
PATCH  /api/groups/:id/members/:uid   - Update member role
```

### Expenses
```
GET    /api/groups/:id/expenses       - List expenses (with filters)
POST   /api/groups/:id/expenses       - Create expense
GET    /api/expenses/:id              - Get expense details
PATCH  /api/expenses/:id              - Update expense
DELETE /api/expenses/:id              - Delete expense
POST   /api/expenses/:id/duplicate    - Duplicate expense
```

### Settlements
```
GET    /api/groups/:id/settlements    - List settlements
POST   /api/groups/:id/settlements    - Create settlement
GET    /api/settlements/:id           - Get settlement details
GET    /api/groups/:id/balances       - Get current balances
GET    /api/groups/:id/balance-suggestions - Get optimized settlements
```

### Analytics
```
GET /api/analytics/personal          - Personal analytics (all groups)
GET /api/analytics/group/:id         - Group analytics
GET /api/analytics/trends            - Spending trends
GET /api/analytics/categories        - Category breakdown
GET /api/analytics/export            - Export data (CSV/PDF)
```

### Notifications
```
GET    /api/notifications            - List notifications
PATCH  /api/notifications/:id        - Mark as read
DELETE /api/notifications/:id        - Delete notification
POST   /api/notifications/mark-all-read - Mark all as read
```

### Invites
```
POST /api/groups/:id/invites         - Generate invite link
GET  /api/invites/:code              - Get invite details
POST /api/invites/:code/accept       - Accept invite
```

### Activity Feed
```
GET /api/groups/:id/activity         - Get activity feed
```

---

## 📱 Pages & Routes Structure

```
/                           - Landing page (public)
/login                      - Login page
/signup                     - Signup page
/reset-password             - Password reset request
/reset-password/confirm     - Password reset confirmation
/invite/:code               - Accept invite

/dashboard                  - Main dashboard (protected)
/groups                     - All groups list
/groups/:id                 - Group detail page
/groups/:id/expenses        - Group expenses list
/groups/:id/analytics       - Group analytics
/groups/:id/settings        - Group settings
/groups/new                 - Create new group

/expenses                   - All expenses (across groups)
/expenses/new               - Add new expense
/expenses/:id               - Expense detail page
/expenses/:id/edit          - Edit expense

/settlements                - All settlements
/settle                     - Settle up flow

/analytics                  - Personal analytics
/analytics/monthly          - Monthly breakdown
/analytics/categories       - Category analysis

/notifications              - Notification center

/profile                    - User profile
/profile/edit               - Edit profile
/profile/settings           - User settings
/profile/preferences        - Notification preferences

/404                        - Not found page
/500                        - Error page
```

---

## 🎨 Component Structure

### Layout Components
```
- AppLayout (main layout with nav)
- DashboardLayout (sidebar + content)
- MobileLayout (bottom nav)
- AuthLayout (centered content for auth pages)
```

### Feature Components

#### Dashboard
```
- BalanceSummaryCard
- QuickStatsGrid
- SettlementSuggestions
- RecentActivityList
- UpcomingExpenses
- GroupSelector
```

#### Expenses
```
- ExpenseList
- ExpenseCard
- ExpenseForm
- ExpenseDetail
- ExpenseSplitBreakdown
- ReceiptViewer
- CategoryIcon
```

#### Groups
```
- GroupList
- GroupCard
- GroupForm
- GroupMembersList
- InviteGenerator
- GroupSettings
```

#### Settlements
```
- SettlementForm
- SettlementHistory
- BalanceCard
- PaymentMethodSelector
```

#### Analytics
```
- SpendingTrendChart (line chart)
- CategoryBreakdownChart (pie chart)
- MonthlyComparisonChart (bar chart)
- InsightsCard
- ExportButton
```

#### Notifications
```
- NotificationBell
- NotificationDropdown
- NotificationList
- NotificationItem
```

### Shared Components
```
- Button
- Input
- Select
- Checkbox
- DatePicker
- Modal
- Toast
- Avatar
- Badge
- Spinner
- EmptyState
- ErrorBoundary
```

---

## 🔧 Key Features Implementation Details

### Balance Calculation Algorithm

```typescript
/**
 * Calculate balances between all group members
 * Returns: Map<userId, Map<otherUserId, amount>>
 * Positive amount = user is owed
 * Negative amount = user owes
 */
function calculateGroupBalances(expenses: Expense[], settlements: Settlement[]) {
  const balances = new Map<string, Map<string, number>>()
  
  // Initialize balances
  expenses.forEach(expense => {
    const paidBy = expense.paid_by_user_id
    
    expense.splits.forEach(split => {
      if (split.user_id === paidBy) return // Skip payer
      
      const amountOwed = split.amount_owed - split.amount_settled
      
      // User owes payer
      addToBalance(balances, split.user_id, paidBy, -amountOwed)
      // Payer is owed by user
      addToBalance(balances, paidBy, split.user_id, amountOwed)
    })
  })
  
  // Subtract settlements
  settlements.forEach(settlement => {
    addToBalance(balances, settlement.from_user_id, settlement.to_user_id, -settlement.amount)
    addToBalance(balances, settlement.to_user_id, settlement.from_user_id, settlement.amount)
  })
  
  return balances
}
```

### Settlement Optimization Algorithm

```typescript
/**
 * Simplify debts to minimize number of transactions
 * Uses greedy algorithm to match largest debtor with largest creditor
 */
function optimizeSettlements(balances: Map<string, number>) {
  const debtors = [] // People who owe money
  const creditors = [] // People who are owed money
  
  // Separate debtors and creditors
  balances.forEach((balance, userId) => {
    if (balance < 0) debtors.push({ userId, amount: -balance })
    if (balance > 0) creditors.push({ userId, amount: balance })
  })
  
  // Sort by amount
  debtors.sort((a, b) => b.amount - a.amount)
  creditors.sort((a, b) => b.amount - a.amount)
  
  const transactions = []
  let i = 0, j = 0
  
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    
    const amount = Math.min(debtor.amount, creditor.amount)
    
    transactions.push({
      from: debtor.userId,
      to: creditor.userId,
      amount
    })
    
    debtor.amount -= amount
    creditor.amount -= amount
    
    if (debtor.amount === 0) i++
    if (creditor.amount === 0) j++
  }
  
  return transactions
}
```

### Recurring Expense Automation

```typescript
/**
 * Cron job to check and create recurring expenses
 * Run daily at midnight
 */
async function processRecurringExpenses() {
  const today = new Date()
  
  // Get all active recurring expenses
  const recurringExpenses = await db.expenses
    .select()
    .where('is_recurring', true)
    .where('is_deleted', false)
  
  for (const expense of recurringExpenses) {
    const rule = expense.recurrence_rule
    
    if (shouldCreateToday(rule, today)) {
      // Create new expense
      const newExpense = {
        ...expense,
        id: generateId(),
        date: today,
        created_at: today,
        is_recurring: false // New expense is not recurring itself
      }
      
      await db.expenses.insert(newExpense)
      
      // Create splits
      await createExpenseSplits(newExpense)
      
      // Notify group members
      await notifyRecurringExpenseCreated(newExpense)
    }
  }
}

function shouldCreateToday(rule: RecurrenceRule, today: Date): boolean {
  // Check if expense should be created today based on rule
  // Daily: every day
  // Weekly: specific day of week
  // Monthly: specific day of month
  // Yearly: specific date
  
  // Implementation details...
}
```

---

## 🎯 MVP Feature Priorities

### Week 1: Foundation
**Must Have:**
- ✅ Project setup (Next.js + Supabase)
- ✅ Database schema creation
- ✅ Authentication (email/password + Google OAuth)
- ✅ Protected routes middleware
- ✅ Basic UI layout (mobile + desktop)
- ✅ Group creation and management
- ✅ Add/view expenses (equal split only)
- ✅ Basic balance calculation

**Nice to Have:**
- Custom split types (defer to week 2)
- Receipt upload (defer to week 3)

### Week 2: Core Features
**Must Have:**
- ✅ Expense list with filters (date, category, member)
- ✅ Edit/delete expenses
- ✅ Expense categories
- ✅ Settlement flow (full and partial)
- ✅ Balance display on dashboard
- ✅ Recent activity feed
- ✅ In-app notifications

**Nice to Have:**
- Email notifications
- Settlement optimization
- Expense history (audit trail)

### Week 3: Enhancements
**Must Have:**
- ✅ Email notifications (Supabase)
- ✅ WhatsApp share functionality (manual)
- ✅ Settlement history
- ✅ Activity feed with filters
- ✅ Invite system
- ✅ User preferences

**Nice to Have:**
- Recurring expenses
- Receipt upload
- Export to CSV

### Week 4: Analytics & Polish
**Must Have:**
- ✅ Personal analytics dashboard
- ✅ Group analytics
- ✅ Charts (spending trends, category breakdown)
- ✅ Archive groups
- ✅ Desktop dashboard optimization
- ✅ Mobile responsive refinements

**Nice to Have:**
- PDF export
- Advanced insights
- WhatsApp automation
- Receipt OCR

### Future Enhancements
- Multi-currency support
- Predictive analytics
- WhatsApp bot (full conversational)
- Mobile native app
- Integration with payment apps
- Budget tracking
- Expense approvals

---

## 🎨 UI/UX Guidelines

### Color Scheme
```css
/* Primary Colors */
--primary: #3B82F6 (blue)
--primary-dark: #2563EB
--primary-light: #60A5FA

/* Semantic Colors */
--success: #10B981 (green - owed to you)
--danger: #EF4444 (red - you owe)
--warning: #F59E0B (yellow - pending)
--info: #6366F1 (purple)

/* Neutral Colors */
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-400: #9CA3AF
--gray-500: #6B7280
--gray-600: #4B5563
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827

/* Background */
--bg-primary: #FFFFFF
--bg-secondary: #F9FAFB
--bg-tertiary: #F3F4F6
```

### Typography
```css
/* Font Family */
--font-primary: 'Inter', sans-serif
--font-mono: 'JetBrains Mono', monospace

/* Font Sizes */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */

/* Font Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing
```css
/* Use Tailwind's spacing scale */
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
```

### Border Radius
```css
--radius-sm: 0.25rem  /* 4px */
--radius-md: 0.5rem   /* 8px */
--radius-lg: 0.75rem  /* 12px */
--radius-xl: 1rem     /* 16px */
--radius-full: 9999px /* Full circle */
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

### Animations
```css
/* Transitions */
--transition-fast: 150ms ease
--transition-base: 200ms ease
--transition-slow: 300ms ease

/* Common animations */
- Fade in/out
- Slide up/down
- Scale in/out
- Skeleton loading
- Shimmer effect
```

### Responsive Breakpoints
```css
--mobile: 640px   /* sm */
--tablet: 768px   /* md */
--desktop: 1024px /* lg */
--wide: 1280px    /* xl */
```

---

## 🔒 Security Considerations

### Authentication
- JWT tokens via Supabase Auth
- Access token: 1 hour expiry
- Refresh token: 30 days expiry
- HTTP-only cookies for refresh tokens
- CSRF protection

### Authorization
- Row Level Security (RLS) on all tables
- Users can only access data from groups they're members of
- Role-based permissions (admin vs member)
- Validate user permissions on every API call

### Data Protection
- All passwords hashed (Supabase handles this)
- Phone numbers encrypted at rest
- Receipts stored in private buckets
- No sensitive data in URLs or logs
- Input sanitization on all forms

### API Security
- Rate limiting on all endpoints
- CORS configuration
- API key rotation
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize user input)

### Privacy
- GDPR compliance (data export, deletion)
- Users can delete their accounts
- Clear privacy policy
- Opt-in for notifications
- No tracking without consent

---

## 🧪 Testing Strategy

### Unit Tests
- Utility functions (balance calculation, date formatting)
- Component logic (hooks, context)
- API route handlers

### Integration Tests
- Database operations
- Authentication flows
- API endpoint chains

### E2E Tests (Playwright/Cypress)
- Complete user flows:
  - Sign up → Create group → Add expense → Settle up
  - Join group via invite
  - Edit/delete expense
  - View analytics

### Manual Testing Checklist
- [ ] Mobile responsive (iOS Safari, Android Chrome)
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Dark mode (if implemented)
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Performance (Lighthouse score >90)
- [ ] Real-time updates work correctly
- [ ] Notifications appear properly
- [ ] Edge cases (division by zero, negative amounts, etc.)

---

## 📊 Performance Optimization

### Frontend
- Code splitting (dynamic imports)
- Image optimization (Next.js Image component)
- Lazy loading (below-the-fold content)
- React Query for caching
- Memoization (useMemo, useCallback)
- Virtual scrolling for long lists

### Backend
- Database indexes on frequently queried columns
- Connection pooling
- Query optimization (select only needed columns)
- Caching (Redis for hot data)
- Pagination for large datasets
- Debouncing expensive operations

### Assets
- Compress images (WebP format)
- Minify CSS/JS
- CDN for static assets
- Font optimization
- Reduce bundle size

---

## 🚀 Deployment

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
NODE_ENV=

# WhatsApp (Phase 2)
WHATSAPP_API_KEY=
WHATSAPP_PHONE_NUMBER_ID=

# Email (Supabase handles this)
# No additional vars needed

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
```

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

### Database Migrations
- Use Supabase migrations
- Version control all schema changes
- Test migrations on staging first
- Rollback plan for each migration

### CI/CD Pipeline
1. Push to GitHub
2. Run tests
3. Build preview on Vercel (PR)
4. Manual approval
5. Deploy to production

---

## 📝 Documentation

### Code Documentation
- JSDoc comments for complex functions
- README.md with setup instructions
- CONTRIBUTING.md for contributors
- API documentation (auto-generated)

### User Documentation
- In-app help tooltips
- FAQ page
- Video tutorials (future)
- Email support

---

## 🐛 Error Handling

### Frontend
```typescript
// Error boundaries for React components
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>

// Toast notifications for user errors
toast.error('Failed to add expense. Please try again.')

// Retry logic for failed requests
const { data, error } = useQuery({
  queryKey: ['expenses'],
  queryFn: fetchExpenses,
  retry: 3,
  retryDelay: 1000
})
```

### Backend
```typescript
// Structured error responses
{
  error: {
    code: 'EXPENSE_NOT_FOUND',
    message: 'Expense not found',
    details: { expenseId: '123' }
  }
}

// Logging (use service like Sentry)
logger.error('Failed to create expense', {
  userId,
  groupId,
  error: error.message
})
```

---

## 🎯 Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Expenses added per user per week
- Settlements made per week
- Time to first expense (onboarding)
- Retention rate (7-day, 30-day)

### Feature Usage
- Groups created
- WhatsApp shares
- Analytics page views
- Notification open rate
- Export feature usage

### Technical
- API response time (p95 < 500ms)
- Error rate (< 1%)
- Uptime (> 99.9%)
- Page load time (< 2s)

---

## 🤝 Support & Feedback

### In-App Feedback
- Feedback form
- Bug report form
- Feature request form

### Support Channels
- Email: support@splitease.com
- In-app chat (future)
- FAQ / Help Center

---

## 📄 Legal & Compliance

### Required Pages
- Terms of Service
- Privacy Policy
- Cookie Policy
- Data Processing Agreement (for GDPR)

### Compliance
- GDPR (EU users)
- Data retention policy
- Right to erasure
- Data portability

---

## 🔮 Future Roadmap

### Phase 2 (After MVP)
- Recurring expenses automation
- WhatsApp webhook integration
- Receipt OCR
- Advanced analytics with insights
- Multi-currency support
- Budget tracking

### Phase 3
- Mobile native app (React Native)
- WhatsApp conversational bot
- Integration with payment apps (UPI, PayPal)
- Expense approvals workflow
- Group spending limits
- AI-powered insights

### Phase 4
- Multi-language support
- Voice input for expenses
- Smart categorization (ML)
- Predictive budgeting
- Social features (leaderboards, challenges)

---

## 📞 Contact & Support

**Developer:** Shashwat  
**Project Start Date:** December 2024  
**Expected MVP Completion:** 4 weeks from start  

---

## 🎉 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account
- Vercel account (for deployment)
- Git

### Initial Setup Steps
1. Clone repository
2. Install dependencies: `npm install`
3. Set up Supabase project
4. Create database tables using provided schema
5. Configure environment variables
6. Run development server: `npm run dev`
7. Start building! 🚀

---

## 📚 Additional Resources

### Technologies to Learn/Review
- Next.js 14 App Router
- Supabase (Database, Auth, Storage, Realtime)
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form + Zod

### Helpful Documentation Links
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs
- React Query: https://tanstack.com/query/latest

---

**End of Project Brief**

This document should serve as the complete reference for building the flatmate expense splitting application. Refer back to this as the single source of truth throughout development.
