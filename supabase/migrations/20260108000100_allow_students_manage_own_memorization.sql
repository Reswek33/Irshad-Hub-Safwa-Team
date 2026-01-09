-- Allow students to manage their own memorization progress
CREATE POLICY "Students can insert own progress" ON public.memorization_progress
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own progress" ON public.memorization_progress
  FOR UPDATE TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);
