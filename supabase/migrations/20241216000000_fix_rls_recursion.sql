-- Fix infinite recursion in group_members RLS policies
-- The issue is that policies were checking group_members from within group_members policies

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Admins can add members" ON public.group_members;
DROP POLICY IF EXISTS "Admins can remove members" ON public.group_members;
DROP POLICY IF EXISTS "Admins can update member roles" ON public.group_members;

-- Recreate group_members policies without recursion
-- Use direct auth.uid() checks instead of subqueries

CREATE POLICY "Users can view members of their groups"
    ON public.group_members FOR SELECT
    USING (user_id = auth.uid() OR group_id IN (
        SELECT gm.group_id FROM public.group_members gm WHERE gm.user_id = auth.uid()
    ));

CREATE POLICY "Admins can add members"
    ON public.group_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.group_members gm
            WHERE gm.group_id = group_members.group_id
            AND gm.user_id = auth.uid()
            AND gm.role = 'admin'
        )
        OR
        -- Allow users to be added by the group creator during group creation
        group_id IN (SELECT id FROM public.groups WHERE created_by = auth.uid())
    );

CREATE POLICY "Admins can remove members"
    ON public.group_members FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members gm
            WHERE gm.group_id = group_members.group_id
            AND gm.user_id = auth.uid()
            AND gm.role = 'admin'
        )
    );

CREATE POLICY "Admins can update member roles"
    ON public.group_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members gm
            WHERE gm.group_id = group_members.group_id
            AND gm.user_id = auth.uid()
            AND gm.role = 'admin'
        )
    );
