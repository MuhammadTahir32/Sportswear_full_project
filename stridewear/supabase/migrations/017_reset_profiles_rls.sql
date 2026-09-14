-- Complete reset of profiles RLS policies
-- Drop ALL existing policies on profiles
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON profiles', pol.policyname);
  END LOOP;
END $$;

-- Recreate clean policies
-- 1. Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR update
  USING (auth.uid() = id);

-- 3. Users can insert their own profile (needed for signup trigger fallback)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR insert
  WITH CHECK (auth.uid() = id);
