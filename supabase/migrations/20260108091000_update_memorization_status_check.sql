-- Expand allowed status values for memorization_progress to match app options
ALTER TABLE public.memorization_progress
  DROP CONSTRAINT IF EXISTS memorization_progress_status_check;

ALTER TABLE public.memorization_progress
  ADD CONSTRAINT memorization_progress_status_check
  CHECK (
    status IN (
      'memorizing', 'memorized', 'revision',
      'in_progress', 'completed', 'pending_review'
    )
  );
