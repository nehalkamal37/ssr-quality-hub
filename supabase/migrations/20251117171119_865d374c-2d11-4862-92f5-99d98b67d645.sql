-- Create enum types for the QA/QC system
CREATE TYPE public.app_role AS ENUM ('admin', 'pm', 'senior_engineer', 'junior_engineer');
CREATE TYPE public.qa_status AS ENUM ('noted', 'open', 'resolved', 'verified', 'closed');
CREATE TYPE public.qa_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE public.discipline_type AS ENUM ('electrical', 'mechanical', 'plumbing', 'civil', 'architectural');
CREATE TYPE public.activity_type AS ENUM ('status_change', 'review_added', 'attachment_uploaded', 'attachment_deleted', 'item_edited', 'import_performed');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Project phases/sheets table
CREATE TABLE public.project_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  discipline discipline_type NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- QA Items table
CREATE TABLE public.qa_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES public.project_phases(id) ON DELETE CASCADE,
  item_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  severity qa_severity NOT NULL DEFAULT 'medium',
  status qa_status NOT NULL DEFAULT 'noted',
  discipline discipline_type NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  started_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reviews/Comments table (multi-level review workflow)
CREATE TABLE public.qa_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qa_item_id UUID NOT NULL REFERENCES public.qa_items(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  reviewer_role app_role NOT NULL,
  comment TEXT NOT NULL,
  status qa_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Attachments table
CREATE TABLE public.qa_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qa_item_id UUID NOT NULL REFERENCES public.qa_items(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activity log table
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  qa_item_id UUID REFERENCES public.qa_items(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES public.project_phases(id),
  activity_type activity_type NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  description TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_phases_updated_at BEFORE UPDATE ON public.project_phases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_qa_items_updated_at BEFORE UPDATE ON public.qa_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for projects
CREATE POLICY "Authenticated users can view projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "PMs and admins can manage projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'pm') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for project_phases
CREATE POLICY "Authenticated users can view phases"
  ON public.project_phases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "PMs and admins can manage phases"
  ON public.project_phases FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'pm') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for qa_items
CREATE POLICY "Authenticated users can view QA items"
  ON public.qa_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create QA items"
  ON public.qa_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update QA items"
  ON public.qa_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "PMs and admins can delete QA items"
  ON public.qa_items FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'pm') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for qa_reviews
CREATE POLICY "Authenticated users can view reviews"
  ON public.qa_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can add reviews"
  ON public.qa_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- RLS Policies for qa_attachments
CREATE POLICY "Authenticated users can view attachments"
  ON public.qa_attachments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload attachments"
  ON public.qa_attachments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own attachments"
  ON public.qa_attachments FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- RLS Policies for activity_log
CREATE POLICY "Authenticated users can view activity log"
  ON public.activity_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert activity log"
  ON public.activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create storage bucket for QA attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('qa-attachments', 'qa-attachments', false);

-- Storage policies for attachments
CREATE POLICY "Authenticated users can view attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'qa-attachments');

CREATE POLICY "Authenticated users can upload attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'qa-attachments');

CREATE POLICY "Users can delete their own attachments"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'qa-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);