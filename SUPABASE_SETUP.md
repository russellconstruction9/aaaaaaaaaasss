# Supabase Database Setup

## Issue
The signup functionality is not working because the required database tables don't exist in your Supabase project.

## Solution
You need to create the database schema in your Supabase project.

### Steps:

1. **Go to your Supabase project dashboard**
   - Visit: https://app.supabase.com/
   - Select your project

2. **Open the SQL Editor**
   - In the left sidebar, click "SQL Editor"
   - Click "New Query"

3. **Run the database setup**
   - Copy the contents of `database-setup.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute the script

4. **Verify the setup**
   - Go to "Table Editor" in the left sidebar
   - You should see the following tables:
     - `businesses`
     - `users` 
     - `projects`
     - `tasks`
     - `time_logs`
     - `punch_list_items`
     - `project_photos`
     - `invoices`
     - `inventory_items`

### What the script does:
- Creates all required database tables
- Sets up proper relationships between tables
- Enables Row Level Security (RLS) for data isolation
- Creates security policies so users only see their business data
- Adds indexes for better performance
- Sets up automatic `updated_at` timestamp triggers

### After running the script:
The signup functionality should work correctly, and users will be able to:
- Create new business accounts
- Sign up as the business admin
- Add team members
- Create projects and manage data

## Alternative: Quick Test Tables
If you want to test quickly, you can create just the minimal tables:

```sql
-- Minimal setup for testing signup
CREATE TABLE businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'Trial',
    subscription_plan TEXT DEFAULT 'Trial',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    business_id UUID REFERENCES businesses(id),
    role TEXT DEFAULT 'Admin',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

This will allow signup to work, and you can run the full script later.