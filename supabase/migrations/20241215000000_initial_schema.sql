-- SplitEase Database Schema
-- Initial migration - Creates all tables, indexes, and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_number TEXT,
    avatar_url TEXT,
    default_currency TEXT DEFAULT 'INR' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Groups table
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('household', 'trip', 'event')) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.users(id) NOT NULL,
    whatsapp_group_link TEXT,
    whatsapp_webhook_url TEXT,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    archived_at TIMESTAMPTZ
);

-- Group members (join table)
CREATE TABLE public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member' NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    default_split_percentage DECIMAL(5,2),
    UNIQUE(group_id, user_id)
);

-- Expenses table
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    paid_by_user_id UUID REFERENCES public.users(id) NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_by UUID REFERENCES public.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE NOT NULL,
    recurrence_rule JSONB,
    receipt_url TEXT,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
);

-- Expense splits table
CREATE TABLE public.expense_splits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    amount_owed DECIMAL(10,2) NOT NULL CHECK (amount_owed >= 0),
    amount_settled DECIMAL(10,2) DEFAULT 0 NOT NULL CHECK (amount_settled >= 0),
    is_fully_settled BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE(expense_id, user_id)
);

-- Settlements table
CREATE TABLE public.settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    from_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    to_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_method TEXT CHECK (payment_method IN ('upi', 'cash', 'bank_transfer', 'other')) NOT NULL,
    reference_id TEXT,
    note TEXT,
    settled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CHECK (from_user_id != to_user_id)
);

-- Expense history (audit trail)
CREATE TABLE public.expense_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE NOT NULL,
    action TEXT CHECK (action IN ('created', 'updated', 'deleted')) NOT NULL,
    changed_by UUID REFERENCES public.users(id) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changes_summary TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Activity feed table
CREATE TABLE public.activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT CHECK (action_type IN (
        'expense_added', 'expense_updated', 'expense_deleted',
        'settlement_made', 'user_joined', 'user_left',
        'group_created', 'group_updated'
    )) NOT NULL,
    entity_id UUID,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN (
        'expense_added', 'expense_updated', 'expense_deleted',
        'settlement_received', 'settlement_reminder',
        'group_invite', 'member_joined'
    )) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    sent_to_email BOOLEAN DEFAULT FALSE NOT NULL,
    sent_to_whatsapp BOOLEAN DEFAULT FALSE NOT NULL,
    email_sent_at TIMESTAMPTZ,
    whatsapp_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Group invites table
CREATE TABLE public.group_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES public.users(id) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User preferences table
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE NOT NULL,
    whatsapp_notifications BOOLEAN DEFAULT TRUE NOT NULL,
    push_notifications BOOLEAN DEFAULT TRUE NOT NULL,
    notification_digest BOOLEAN DEFAULT FALSE NOT NULL,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    notification_types JSONB DEFAULT '{}' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Monthly expense summary (for analytics performance)
CREATE TABLE public.monthly_expense_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    month DATE NOT NULL,
    total_spent DECIMAL(10,2) DEFAULT 0 NOT NULL,
    total_share DECIMAL(10,2) DEFAULT 0 NOT NULL,
    net_contribution DECIMAL(10,2) DEFAULT 0 NOT NULL,
    expenses_count INTEGER DEFAULT 0 NOT NULL,
    settlements_made DECIMAL(10,2) DEFAULT 0 NOT NULL,
    settlements_received DECIMAL(10,2) DEFAULT 0 NOT NULL,
    category_breakdown JSONB DEFAULT '{}' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(group_id, user_id, month)
);

-- Balance snapshots (for trend analysis)
CREATE TABLE public.balance_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    other_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    balance DECIMAL(10,2) NOT NULL,
    snapshot_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(group_id, user_id, other_user_id, snapshot_date),
    CHECK (user_id != other_user_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);

-- Groups indexes
CREATE INDEX idx_groups_created_by ON public.groups(created_by);
CREATE INDEX idx_groups_is_archived ON public.groups(is_archived);

-- Group members indexes
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);

-- Expenses indexes
CREATE INDEX idx_expenses_group_id ON public.expenses(group_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_created_by ON public.expenses(created_by);
CREATE INDEX idx_expenses_paid_by ON public.expenses(paid_by_user_id);
CREATE INDEX idx_expenses_is_deleted ON public.expenses(is_deleted);

-- Expense splits indexes
CREATE INDEX idx_expense_splits_expense_id ON public.expense_splits(expense_id);
CREATE INDEX idx_expense_splits_user_id ON public.expense_splits(user_id);
CREATE INDEX idx_expense_splits_settled ON public.expense_splits(is_fully_settled);

-- Settlements indexes
CREATE INDEX idx_settlements_group_id ON public.settlements(group_id);
CREATE INDEX idx_settlements_from_user ON public.settlements(from_user_id);
CREATE INDEX idx_settlements_to_user ON public.settlements(to_user_id);
CREATE INDEX idx_settlements_settled_at ON public.settlements(settled_at);

-- Activity feed indexes
CREATE INDEX idx_activity_feed_group_id ON public.activity_feed(group_id);
CREATE INDEX idx_activity_feed_created_at ON public.activity_feed(created_at DESC);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Group invites indexes
CREATE INDEX idx_group_invites_group_id ON public.group_invites(group_id);
CREATE INDEX idx_group_invites_code ON public.group_invites(invite_code);
CREATE INDEX idx_group_invites_expires_at ON public.group_invites(expires_at);

-- Monthly summary indexes
CREATE INDEX idx_monthly_summary_group_user ON public.monthly_expense_summary(group_id, user_id);
CREATE INDEX idx_monthly_summary_month ON public.monthly_expense_summary(month);

-- Balance snapshots indexes
CREATE INDEX idx_balance_snapshots_group_user ON public.balance_snapshots(group_id, user_id);
CREATE INDEX idx_balance_snapshots_date ON public.balance_snapshots(snapshot_date);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at for users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for expenses
CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for user_preferences
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for monthly_expense_summary
CREATE TRIGGER update_monthly_summary_updated_at
    BEFORE UPDATE ON public.monthly_expense_summary
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_expense_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balance_snapshots ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Groups policies
CREATE POLICY "Users can view groups they are members of"
    ON public.groups FOR SELECT
    USING (
        id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create groups"
    ON public.groups FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update group settings"
    ON public.groups FOR UPDATE
    USING (
        id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete groups"
    ON public.groups FOR DELETE
    USING (
        id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Group members policies
CREATE POLICY "Users can view members of their groups"
    ON public.group_members FOR SELECT
    USING (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can add members"
    ON public.group_members FOR INSERT
    WITH CHECK (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can remove members"
    ON public.group_members FOR DELETE
    USING (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Expenses policies
CREATE POLICY "Users can view expenses in their groups"
    ON public.expenses FOR SELECT
    USING (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Group members can create expenses"
    ON public.expenses FOR INSERT
    WITH CHECK (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
        AND auth.uid() = created_by
    );

CREATE POLICY "Creators and admins can update expenses"
    ON public.expenses FOR UPDATE
    USING (
        created_by = auth.uid()
        OR group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Creators and admins can delete expenses"
    ON public.expenses FOR DELETE
    USING (
        created_by = auth.uid()
        OR group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Expense splits policies
CREATE POLICY "Users can view splits in their group expenses"
    ON public.expense_splits FOR SELECT
    USING (
        expense_id IN (
            SELECT id FROM public.expenses
            WHERE group_id IN (
                SELECT group_id FROM public.group_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Group members can create expense splits"
    ON public.expense_splits FOR INSERT
    WITH CHECK (
        expense_id IN (
            SELECT id FROM public.expenses
            WHERE group_id IN (
                SELECT group_id FROM public.group_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Group members can update expense splits"
    ON public.expense_splits FOR UPDATE
    USING (
        expense_id IN (
            SELECT id FROM public.expenses
            WHERE group_id IN (
                SELECT group_id FROM public.group_members
                WHERE user_id = auth.uid()
            )
        )
    );

-- Settlements policies
CREATE POLICY "Users can view settlements in their groups"
    ON public.settlements FOR SELECT
    USING (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Group members can create settlements"
    ON public.settlements FOR INSERT
    WITH CHECK (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
        AND from_user_id = auth.uid()
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
    ON public.notifications FOR DELETE
    USING (user_id = auth.uid());

-- User preferences policies
CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Activity feed policies
CREATE POLICY "Users can view activity in their groups"
    ON public.activity_feed FOR SELECT
    USING (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
    );

-- Group invites policies
CREATE POLICY "Anyone can view active invites"
    ON public.group_invites FOR SELECT
    USING (is_active = true AND expires_at > NOW());

CREATE POLICY "Admins can create invites"
    ON public.group_invites FOR INSERT
    WITH CHECK (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Expense history policies (read-only for auditing)
CREATE POLICY "Users can view expense history in their groups"
    ON public.expense_history FOR SELECT
    USING (
        expense_id IN (
            SELECT id FROM public.expenses
            WHERE group_id IN (
                SELECT group_id FROM public.group_members
                WHERE user_id = auth.uid()
            )
        )
    );

-- Monthly summary and balance snapshots policies
CREATE POLICY "Users can view own summaries"
    ON public.monthly_expense_summary FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can view balances in their groups"
    ON public.balance_snapshots FOR SELECT
    USING (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- COMMENTS (Documentation)
-- =====================================================

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.groups IS 'Groups for organizing expenses (household, trip, event)';
COMMENT ON TABLE public.group_members IS 'Join table for users and groups with roles';
COMMENT ON TABLE public.expenses IS 'Individual expenses with payment and split information';
COMMENT ON TABLE public.expense_splits IS 'How expenses are split among group members';
COMMENT ON TABLE public.settlements IS 'Payment records between users';
COMMENT ON TABLE public.expense_history IS 'Audit trail for expense changes';
COMMENT ON TABLE public.activity_feed IS 'Real-time activity feed for groups';
COMMENT ON TABLE public.notifications IS 'User notifications for various events';
COMMENT ON TABLE public.group_invites IS 'Invite links for joining groups';
COMMENT ON TABLE public.user_preferences IS 'User notification and app preferences';
COMMENT ON TABLE public.monthly_expense_summary IS 'Pre-aggregated monthly statistics for performance';
COMMENT ON TABLE public.balance_snapshots IS 'Daily balance snapshots for trend analysis';
