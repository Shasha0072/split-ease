-- Add UPDATE policies for group_invites table
-- This allows admins to deactivate invites and the system to increment usage counters

-- Allow admins to update invites (for deactivation)
CREATE POLICY "Admins can update invites"
    ON public.group_invites FOR UPDATE
    USING (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Allow system to increment current_uses when invite is accepted
CREATE POLICY "System can increment invite uses"
    ON public.group_invites FOR UPDATE
    USING (is_active = true AND expires_at > NOW())
    WITH CHECK (is_active = true);

-- Add comment
COMMENT ON TABLE public.group_invites IS 'Stores invite links for group membership. Admins can create and deactivate invites.';
