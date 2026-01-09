import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  FileText,
  Plus,
  GraduationCap,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Test {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string | null;
  max_score: number;
  course_id: string | null;
}

interface StudentOption {
  user_id: string;
  full_name: string;
}

interface CourseOption {
  id: string;
  name: string;
}

export default function TeacherTests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [courseStudents, setCourseStudents] = useState<
    Record<string, StudentOption[]>
  >({});
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resultSavingId, setResultSavingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    maxScore: "100",
    courseId: "unassigned",
  });
  const [resultForm, setResultForm] = useState<
    Record<
      string,
      { studentId: string; score: string; grade: string; feedback: string }
    >
  >({});

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [testsRes, coursesRes] = await Promise.all([
        supabase
          .from("tests")
          .select("id, title, description, scheduled_at, max_score, course_id")
          .eq("teacher_id", user?.id)
          .order("scheduled_at", { ascending: true }),
        supabase
          .from("courses")
          .select("id, name, teacher_id")
          .eq("teacher_id", user?.id)
          .order("created_at", { ascending: false }),
      ]);

      if (testsRes.error) {
        toast({
          title: "Failed to load tests",
          description: testsRes.error.message,
          variant: "destructive",
        });
      } else {
        setTests(testsRes.data || []);
      }

      if (coursesRes.error) {
        console.error(coursesRes.error);
      } else {
        setCourses(coursesRes.data || []);
      }

      const testsData = testsRes.data || [];
      const courseIds = Array.from(
        new Set(
          testsData
            .map((t) => t.course_id)
            .filter((id): id is string => Boolean(id))
        )
      );

      if (courseIds.length === 0) {
        setCourseStudents({});
        setStudents([]);
        return;
      }

      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("course_id, student_id")
        .in("course_id", courseIds);

      if (enrollmentsError) {
        console.error(enrollmentsError);
        return;
      }

      const studentIds = Array.from(
        new Set((enrollments || []).map((e) => e.student_id))
      );

      if (studentIds.length === 0) {
        setCourseStudents({});
        setStudents([]);
        return;
      }

      const { data: studentProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", studentIds);

      if (profilesError) {
        console.error(profilesError);
        return;
      }

      const nameById = new Map(
        (studentProfiles || []).map((s) => [s.user_id, s.full_name])
      );

      const courseStudentMap: Record<string, StudentOption[]> = {};
      (enrollments || []).forEach((enrollment) => {
        const fullName = nameById.get(enrollment.student_id);
        if (!fullName) return;
        const list = courseStudentMap[enrollment.course_id] || [];
        if (!list.some((s) => s.user_id === enrollment.student_id)) {
          list.push({ user_id: enrollment.student_id, full_name: fullName });
        }
        courseStudentMap[enrollment.course_id] = list;
      });

      setCourseStudents(courseStudentMap);
      setStudents(
        Array.from(nameById.entries()).map(([user_id, full_name]) => ({
          user_id,
          full_name,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [toast, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createTest = async () => {
    if (!user) return;
    if (!form.title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }

    const maxScoreNum = Number(form.maxScore) || 0;
    setSaving(true);
    const { error } = await supabase.from("tests").insert({
      title: form.title,
      description: form.description || null,
      scheduled_at: form.scheduledAt || null,
      max_score: maxScoreNum,
      course_id: form.courseId === "unassigned" ? null : form.courseId,
      teacher_id: user.id,
    });

    if (error) {
      toast({
        title: "Create failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Test created" });
      setForm({
        title: "",
        description: "",
        scheduledAt: "",
        maxScore: "100",
        courseId: "unassigned",
      });
      fetchData();
    }
    setSaving(false);
  };

  const deleteTest = async (id: string) => {
    const { error } = await supabase.from("tests").delete().eq("id", id);
    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchData();
    }
  };

  const saveResult = async (testId: string) => {
    const data = resultForm[testId];
    if (!data || !data.studentId || !data.score) {
      toast({
        title: "Missing fields",
        description: "Select student and score.",
        variant: "destructive",
      });
      return;
    }
    const scoreNum = Number(data.score);
    setResultSavingId(testId);
    const { error } = await supabase.from("test_results").insert({
      test_id: testId,
      student_id: data.studentId,
      score: scoreNum,
      grade: data.grade || null,
      feedback: data.feedback || null,
    });
    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Result recorded" });
      setResultForm((prev) => ({
        ...prev,
        [testId]: { studentId: "", score: "", grade: "", feedback: "" },
      }));
    }
    setResultSavingId(null);
  };

  const allStudentOptions = useMemo(
    () => [...students].sort((a, b) => a.full_name.localeCompare(b.full_name)),
    [students]
  );

  const courseStudentOptions = useMemo(() => {
    const sorted: Record<string, StudentOption[]> = {};
    Object.entries(courseStudents).forEach(([courseId, list]) => {
      sorted[courseId] = [...list].sort((a, b) =>
        a.full_name.localeCompare(b.full_name)
      );
    });
    return sorted;
  }, [courseStudents]);

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Tests & Evaluations
        </h2>
        <p className="text-muted-foreground">
          Create, schedule, and record evaluations for your students.
        </p>
      </div>

      {/* Create Test */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">New Test</h3>
              <p className="text-sm text-muted-foreground">
                Schedule an evaluation
              </p>
            </div>
          </div>
          <Button onClick={createTest} disabled={saving}>
            <Plus className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Create"}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Juz' 30 Oral Test"
            />
          </div>
          <div className="space-y-2">
            <Label>Scheduled At</Label>
            <Input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Max Score</Label>
            <Input
              type="number"
              min={1}
              value={form.maxScore}
              onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Program / Course (optional)</Label>
            <Select
              value={form.courseId}
              onValueChange={(v) => setForm({ ...form, courseId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What will be evaluated"
          />
        </div>
      </div>

      {/* Scheduled Tests */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Scheduled Tests
        </h3>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : tests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <GraduationCap className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No tests scheduled.</p>
            <p className="text-sm text-center mt-1">
              Create a new test to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((t) => (
              <div
                key={t.id}
                className="p-4 border border-border/50 rounded-xl bg-muted/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{t.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.description || "No description"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.scheduled_at
                        ? new Date(t.scheduled_at).toLocaleString()
                        : "Not scheduled"}{" "}
                      · Max {t.max_score}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTest(t.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                {/* Quick Result Entry */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div className="space-y-2">
                    <Label>Student</Label>
                    <Select
                      value={resultForm[t.id]?.studentId ?? ""}
                      onValueChange={(v) =>
                        setResultForm((prev) => ({
                          ...prev,
                          [t.id]: {
                            ...prev[t.id],
                            studentId: v,
                            score: prev[t.id]?.score || "",
                            grade: prev[t.id]?.grade || "",
                            feedback: prev[t.id]?.feedback || "",
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {(t.course_id
                          ? courseStudentOptions[t.course_id] || []
                          : allStudentOptions
                        ).map((s) => (
                          <SelectItem key={s.user_id} value={s.user_id}>
                            {s.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Score</Label>
                    <Input
                      type="number"
                      value={resultForm[t.id]?.score || "0"}
                      onChange={(e) =>
                        setResultForm((prev) => ({
                          ...prev,
                          [t.id]: {
                            ...prev[t.id],
                            score: e.target.value,
                            studentId: prev[t.id]?.studentId || "",
                            grade: prev[t.id]?.grade || "",
                            feedback: prev[t.id]?.feedback || "",
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Grade (optional)</Label>
                    <Input
                      value={resultForm[t.id]?.grade || ""}
                      onChange={(e) =>
                        setResultForm((prev) => ({
                          ...prev,
                          [t.id]: {
                            ...prev[t.id],
                            grade: e.target.value,
                            studentId: prev[t.id]?.studentId || "",
                            score: prev[t.id]?.score || "",
                            feedback: prev[t.id]?.feedback || "",
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Feedback (optional)</Label>
                    <Input
                      value={resultForm[t.id]?.feedback || ""}
                      onChange={(e) =>
                        setResultForm((prev) => ({
                          ...prev,
                          [t.id]: {
                            ...prev[t.id],
                            feedback: e.target.value,
                            studentId: prev[t.id]?.studentId || "",
                            score: prev[t.id]?.score || "",
                            grade: prev[t.id]?.grade || "",
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <Button
                    size="sm"
                    onClick={() => saveResult(t.id)}
                    disabled={resultSavingId === t.id}
                  >
                    {resultSavingId === t.id ? "Saving..." : "Record Result"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Placeholder for historical results */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Notes
        </h3>
        <p className="text-sm text-muted-foreground">
          Recent results are recorded per test above. A dedicated results view
          can be added later for analytics.
        </p>
      </div>
    </>
  );
}
