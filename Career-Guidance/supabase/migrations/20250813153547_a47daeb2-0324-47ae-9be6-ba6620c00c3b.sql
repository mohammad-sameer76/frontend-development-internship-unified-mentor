-- Create colleges table
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  rating DECIMAL(3,2) DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  fees_per_year INTEGER NOT NULL,
  placement_rate INTEGER DEFAULT 0,
  courses TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  scholarships TEXT[] DEFAULT '{}',
  eligibility JSONB DEFAULT '{}',
  image_url TEXT,
  description TEXT,
  website_url TEXT,
  established_year INTEGER,
  type TEXT DEFAULT 'Engineering',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create aptitude_tests table
CREATE TABLE public.aptitude_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_questions INTEGER NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  academic_score DECIMAL(5,2),
  entrance_exam_score DECIMAL(5,2),
  preferred_field TEXT,
  preferred_location TEXT,
  budget_max INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create test_results table
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  test_id UUID REFERENCES public.aptitude_tests ON DELETE CASCADE,
  score INTEGER NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create college_applications table
CREATE TABLE public.college_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  college_id UUID REFERENCES public.colleges ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  documents JSONB DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for colleges (public read access)
CREATE POLICY "Colleges are viewable by everyone" 
ON public.colleges 
FOR SELECT 
USING (true);

-- Create policies for aptitude_tests (public read access)
CREATE POLICY "Tests are viewable by everyone" 
ON public.aptitude_tests 
FOR SELECT 
USING (true);

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for test_results
CREATE POLICY "Users can view their own test results" 
ON public.test_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test results" 
ON public.test_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for college_applications
CREATE POLICY "Users can view their own applications" 
ON public.college_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" 
ON public.college_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.college_applications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_colleges_updated_at
  BEFORE UPDATE ON public.colleges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aptitude_tests_updated_at
  BEFORE UPDATE ON public.aptitude_tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample college data
INSERT INTO public.colleges (name, location, city, state, rating, total_students, fees_per_year, placement_rate, courses, type, established_year, description) VALUES
('Indian Institute of Technology, Delhi', 'New Delhi, India', 'New Delhi', 'Delhi', 4.8, 8000, 250000, 98, ARRAY['Computer Science', 'Mechanical', 'Electrical', 'Chemical'], 'Engineering', 1961, 'Premier engineering institution with excellent placement records'),
('National Institute of Technology, Trichy', 'Tiruchirappalli, Tamil Nadu', 'Tiruchirappalli', 'Tamil Nadu', 4.6, 9500, 180000, 95, ARRAY['Engineering', 'Management', 'Science'], 'Engineering', 1964, 'Leading technical institution in South India'),
('Birla Institute of Technology and Science', 'Pilani, Rajasthan', 'Pilani', 'Rajasthan', 4.7, 12000, 420000, 92, ARRAY['Engineering', 'Pharmacy', 'Sciences'], 'Engineering', 1964, 'Private deemed university with strong industry connections');

-- Insert sample aptitude test
INSERT INTO public.aptitude_tests (title, description, duration_minutes, total_questions, questions) VALUES
('General Aptitude Test', 'Comprehensive test covering verbal, quantitative, and logical reasoning', 60, 30, '[
  {
    "id": 1,
    "type": "verbal",
    "question": "Choose the word that best completes the sentence: The professor''s lecture was so _____ that many students fell asleep.",
    "options": ["engaging", "monotonous", "exciting", "interactive"],
    "correct": 1
  },
  {
    "id": 2,
    "type": "quantitative",
    "question": "If a train travels 120 km in 2 hours, what is its speed in km/h?",
    "options": ["50", "60", "70", "80"],
    "correct": 1
  },
  {
    "id": 3,
    "type": "logical",
    "question": "What comes next in the sequence: 2, 4, 8, 16, ?",
    "options": ["24", "28", "32", "36"],
    "correct": 2
  }
]'::jsonb);