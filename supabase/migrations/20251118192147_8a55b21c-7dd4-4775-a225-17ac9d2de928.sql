-- Create project sheets table
CREATE TABLE public.project_sheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_id UUID NOT NULL REFERENCES public.project_phases(id) ON DELETE CASCADE,
  sheet_number TEXT NOT NULL,
  sheet_name TEXT NOT NULL,
  discipline discipline_type NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_sheets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view sheets"
ON public.project_sheets
FOR SELECT
USING (true);

CREATE POLICY "PMs and admins can manage sheets"
ON public.project_sheets
FOR ALL
USING (has_role(auth.uid(), 'pm'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Add sheet_id to qa_items
ALTER TABLE public.qa_items ADD COLUMN sheet_id UUID REFERENCES public.project_sheets(id);

-- Create trigger for updated_at
CREATE TRIGGER update_project_sheets_updated_at
  BEFORE UPDATE ON public.project_sheets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();