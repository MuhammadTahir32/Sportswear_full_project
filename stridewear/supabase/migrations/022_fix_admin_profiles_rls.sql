-- Fix: Drop the recursive policy and use a security definer function instead
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a helper function that checks admin role (security definer bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
$$;

-- Admin can read all profiles (uses is_admin() which bypasses RLS)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin());
