-- Fix infinite recursion in profiles RLS policy
-- The admin policy was referencing profiles from within profiles, causing recursion

-- Drop the recursive admin policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Recreate admin policy using auth.users instead of profiles (no self-reference)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        raw_user_meta_data ->> 'role' = 'admin'
        OR raw_user_meta_data ->> 'role' = 'super_admin'
      )
    )
  );
