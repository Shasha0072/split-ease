-- Fix groups RLS policies to allow group creation
-- The issue: INSERT policy checks group_members, but user isn't a member yet during creation

-- Drop existing groups policies
DROP POLICY IF EXISTS "Users can view groups they are members of" ON public.groups;
DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
DROP POLICY IF EXISTS "Admins can update group settings" ON public.groups;
DROP POLICY IF EXISTS "Admins can delete groups" ON public.groups;

-- Recreate groups policies with proper logic

-- SELECT: Users can view groups they created OR are members of
CREATE POLICY "Users can view their groups"
    ON public.groups FOR SELECT
    USING (
        created_by = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_members.group_id = groups.id
            AND group_members.user_id = auth.uid()
        )
    );

-- INSERT: Allow any authenticated user to create a group
CREATE POLICY "Authenticated users can create groups"
    ON public.groups FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- UPDATE: Only creator can update
CREATE POLICY "Group creators can update groups"
    ON public.groups FOR UPDATE
    USING (created_by = auth.uid());

-- DELETE: Only creator can delete
CREATE POLICY "Group creators can delete groups"
    ON public.groups FOR DELETE
    USING (created_by = auth.uid());
