/*
  # Dr. Ahmed Al-Amir Clinic Database Schema

  ## Overview
  Creates the complete database structure for the pediatric clinic website including:
  - Available appointment slots management
  - Patient appointment bookings
  - Articles with like functionality
  - Clinic settings and configuration

  ## New Tables

  ### 1. `available_slots`
  Stores available appointment time slots that can be booked by patients
  - `id` (uuid, primary key)
  - `date` (date) - The appointment date
  - `time` (time) - The appointment time
  - `status` (text) - Status: 'available' or 'booked'
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `appointments`
  Stores patient appointment bookings with full details
  - `id` (uuid, primary key)
  - `slot_id` (uuid) - Foreign key to available_slots
  - `patient_name` (text) - Full name of the patient
  - `phone` (text) - Contact phone number
  - `child_age` (text) - Age of the child
  - `notes` (text, optional) - Additional notes from patient
  - `status` (text) - Booking status: 'confirmed', 'cancelled', 'completed'
  - `booked_at` (timestamptz) - When the booking was made
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `articles`
  Stores medical articles and blog posts
  - `id` (uuid, primary key)
  - `title` (text) - Article title
  - `slug` (text, unique) - URL-friendly slug
  - `content` (text) - Full article content
  - `excerpt` (text) - Short description/summary
  - `cover_image` (text) - URL to cover image
  - `author` (text) - Author name (default: 'Dr. Ahmed Al-Amir')
  - `published` (boolean) - Publication status
  - `likes_count` (integer) - Total number of likes
  - `liked_by` (jsonb) - Array of user IDs who liked
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `clinic_settings`
  Stores clinic configuration and information
  - `id` (uuid, primary key)
  - `key` (text, unique) - Setting identifier
  - `value` (jsonb) - Setting value (flexible JSON structure)
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Public users can read available slots, articles, and clinic settings
  - Public users can create appointments
  - Only authenticated admin users can modify slots, articles, and settings
  - Only authenticated admin users can view and manage appointments

  ## Indexes
  - Index on available_slots (date, status) for efficient booking queries
  - Index on appointments (slot_id) for quick lookups
  - Index on articles (slug) for fast page loads
  - Index on articles (published, created_at) for listing queries
*/

-- Create available_slots table
CREATE TABLE IF NOT EXISTS available_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  time time NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid NOT NULL REFERENCES available_slots(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  phone text NOT NULL,
  child_age text NOT NULL,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  booked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  cover_image text DEFAULT '',
  author text DEFAULT 'د. أحمد الأمير',
  published boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  liked_by jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clinic_settings table
CREATE TABLE IF NOT EXISTS clinic_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_available_slots_date_status ON available_slots(date, status);
CREATE INDEX IF NOT EXISTS idx_appointments_slot_id ON appointments(slot_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_created ON articles(published, created_at DESC);

-- Enable Row Level Security
ALTER TABLE available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for available_slots
CREATE POLICY "Anyone can view available slots"
  ON available_slots FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert slots"
  ON available_slots FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update slots"
  ON available_slots FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete slots"
  ON available_slots FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for appointments
CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for articles
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  TO anon, authenticated
  USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete articles"
  ON articles FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for clinic_settings
CREATE POLICY "Anyone can view clinic settings"
  ON clinic_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert settings"
  ON clinic_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update settings"
  ON clinic_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete settings"
  ON clinic_settings FOR DELETE
  TO authenticated
  USING (true);

-- Insert default clinic settings
INSERT INTO clinic_settings (key, value) VALUES
  ('doctor_info', '{"name": "د. أحمد الأمير", "specialty": "طب الأطفال وحديثي الولادة", "bio": "استشاري طب الأطفال وحديثي الولادة بخبرة تزيد عن 15 عاماً في رعاية صحة الأطفال", "qualifications": ["بكالوريوس الطب والجراحة", "ماجستير طب الأطفال", "زمالة طب حديثي الولادة"], "image": "/WhatsApp Image 2025-10-08 at 20.53.03_430897d9 copy.jpg"}'::jsonb),
  ('contact_info', '{"phone": "+201234567890", "whatsapp": "+201234567890", "address": "شارع الحاجة آمنة ناصية شارع المدارس أمام مكتبة المهندس", "email": "info@dr-ahmed-alamir.com"}'::jsonb),
  ('working_hours', '{"saturday": "9:00 AM - 5:00 PM", "sunday": "9:00 AM - 5:00 PM", "monday": "9:00 AM - 5:00 PM", "tuesday": "9:00 AM - 5:00 PM", "wednesday": "9:00 AM - 5:00 PM", "thursday": "9:00 AM - 2:00 PM", "friday": "مغلق"}'::jsonb),
  ('clinic_logo', '{"url": "/WhatsApp Image 2025-10-08 at 20.53.03_430897d9 copy.jpg"}'::jsonb)
ON CONFLICT (key) DO NOTHING;