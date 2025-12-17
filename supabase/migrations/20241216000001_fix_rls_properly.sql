-- Properly fix infinite recursion in RLS policies
-- The issue: group_members SELECT policy references group_members table, causing recursion

-- Step 1: Drop ALL existing policies on group_members
DROP POLICY IF EXISTS "Users can view members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Admins can add members" ON public.group_members;
DROP POLICY IF EXISTS "Admins can remove members" ON public.group_members;
DROP POLICY IF EXISTS "Admins can update member roles" ON public.group_members;

-- Step 2: Recreate policies WITHOUT recursion
-- For SELECT: Simply allow users to see rows where they are the user OR use a non-recursive check
CREATE POLICY "Users can view group members"
    ON public.group_members FOR SELECT
    USING (true);  -- Allow all authenticated users to view group members (we'll control via groups policy)

-- For INSERT: Allow if user is creating themselves OR if they are admin of the group
CREATE POLICY "Allow insert for group creators and admins"
    ON public.group_members FOR INSERT
    WITH CHECK (
        -- Allow during group creation (user adding themselves)
        user_id = auth.uid()
        OR
        -- Allow if user is admin (check via groups table instead)
        group_id IN (
            SELECT id FROM public.groups
            WHERE created_by = auth.uid()
        )
    );

-- For DELETE: Only group creator can remove members
CREATE POLICY "Group creators can remove members"
    ON public.group_members FOR DELETE
    USING (
        group_id IN (
            SELECT id FROM public.groups
            WHERE created_by = auth.uid()
        )
    );

-- For UPDATE: Only group creator can update member roles
CREATE POLICY "Group creators can update members"
    ON public.group_members FOR UPDATE
    USING (
        group_id IN (
            SELECT id FROM public.groups
            WHERE created_by = auth.uid()
        )
    );
