# Database Schema Documentation

This directory contains SQL migrations for the SplitEase database.

## Migrations

### `20241215000000_initial_schema.sql`

Initial database schema including:

#### Tables Created:
1. **users** - User profiles extending Supabase auth.users
2. **groups** - Groups for organizing expenses (household, trip, event)
3. **group_members** - Join table for users and groups with roles
4. **expenses** - Individual expenses with payment and split information
5. **expense_splits** - How expenses are split among group members
6. **settlements** - Payment records between users
7. **expense_history** - Audit trail for expense changes
8. **activity_feed** - Real-time activity feed for groups
9. **notifications** - User notifications for various events
10. **group_invites** - Invite links for joining groups
11. **user_preferences** - User notification and app preferences
12. **monthly_expense_summary** - Pre-aggregated monthly statistics
13. **balance_snapshots** - Daily balance snapshots for trend analysis

#### Features:
- ✅ Row Level Security (RLS) policies on all tables
- ✅ Indexes for performance optimization
- ✅ Triggers for auto-updating timestamps
- ✅ Functions for common operations
- ✅ Foreign key relationships with CASCADE deletes
- ✅ Check constraints for data integrity

## Applying Migrations

### Option 1: Supabase Dashboard (Recommended for Development)
1. Go to SQL Editor in Supabase Dashboard
2. Copy the contents of the migration file
3. Paste and run

### Option 2: Supabase CLI (for Production)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref dvbmtcwvnhnrsgtpseku

# Push migrations
supabase db push
```

## Database Diagram

```
users (extends auth.users)
  ├─> groups (created_by)
  ├─> group_members
  ├─> expenses (created_by, paid_by)
  ├─> settlements (from_user, to_user)
  └─> notifications

groups
  ├─> group_members
  ├─> expenses
  ├─> settlements
  ├─> activity_feed
  └─> group_invites

expenses
  ├─> expense_splits
  └─> expense_history
```

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Users**: Can only view/update own profile
- **Groups**: Can only view groups they're members of
- **Expenses**: Can view expenses in their groups, create/edit own expenses
- **Settlements**: Can view settlements in their groups, create settlements they're paying
- **Notifications**: Can only view/update own notifications

## Performance Optimizations

### Indexes Created:
- Foreign key columns for fast joins
- Frequently queried columns (date, is_deleted, is_read, etc.)
- Composite indexes for common query patterns

### Aggregated Tables:
- `monthly_expense_summary` - Pre-calculated monthly statistics
- `balance_snapshots` - Daily balance tracking for trends

## TypeScript Types

Corresponding TypeScript types are auto-generated in:
- `lib/types/database.types.ts`

These provide full type safety when querying the database from the Next.js application.

## Security Considerations

1. **RLS Policies**: All user data is protected by Row Level Security
2. **Auth Integration**: User authentication handled by Supabase Auth
3. **Cascade Deletes**: Related data is automatically cleaned up
4. **Data Validation**: Check constraints ensure data integrity
5. **Audit Trail**: `expense_history` table tracks all changes

## Next Steps

After applying this migration:
1. ✅ Verify tables created in Supabase Dashboard
2. Test RLS policies with authenticated users
3. Create seed data for development
4. Set up database backups
5. Monitor performance and add additional indexes as needed
