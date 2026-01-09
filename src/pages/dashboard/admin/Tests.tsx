import { useEffect, useState } from "react";
import { ClipboardList, Plus, Calendar, GraduationCap, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CourseOption {
  id: string;
  name: string;
  teacher_id: string | null;
  teacher_name?: string | null;
}

interface TestRow {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string | null;
  max_score: number;
  course_id: string | null;
  teacher_name: string | null;
  course_name: string | null;
}

export default function AdminTests() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [tests, setTests] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    maxScore: "100",
    courseId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [coursesRes, teachersRes, testsRes] = await Promise.all([
      supabase.from("courses").select("id, name, teacher_id"),
      supabase
        .from("profiles")
        .select("user_id, full_name")
        .in(
          "user_id",
          (
            await supabase
              .from("user_roles")
              .select("user_id")
              .eq("role", "teacher")
          ).data?.map((r) => r.user_id) || []
        ),
      supabase
        .from("tests")
        .select("id, title, description, scheduled_at, max_score, course_id, teacher_id")
        .order("scheduled_at", { ascending: true }),
    ]);

    const teacherMap: Record<string, string> = {};
    if (!teachersRes.error && teachersRes.data) {
      teachersRes.data.forEach((t) => {
        teacherMap[t.user_id] = t.full_name;
      });
    }

    if (!coursesRes.error) {
      const mappedCourses = (coursesRes.data || []).map((c) => ({
        ...c,
        teacher_name: c.teacher_id ? teacherMap[c.teacher_id] || null : null,
      }));
      setCourses(mappedCourses);
    }

    if (!testsRes.error) {
      // Build course map for quick name lookup
      const courseMap: Record<string, string> = {};
      (coursesRes.data || []).forEach((c) => {
        courseMap[c.id] = c.name;
      });

      const mappedTests = (testsRes.data || []).map((t) => ({
        id: t.id as string,
        title: t.title as string,
        description: (t as any).description || null,
        scheduled_at: (t as any).scheduled_at || null,
        max_score: Number((t as any).max_score) || 0,
        course_id: (t as any).course_id || null,
        teacher_name: (t as any).teacher_id ? teacherMap[(t as any).teacher_id] || null : null,
        course_name: (t as any).course_id ? courseMap[(t as any).course_id] || null : null,
      }));
      setTests(mappedTests);
    }
    setLoading(false);
  };

  const createTest = async () => {
    if (!form.title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    const maxScoreNum = Number(form.maxScore) || 0;
    const isUnassigned = form.courseId === "unassigned" || form.courseId === "";
    const selectedCourse = courses.find((c) => c.id === form.courseId);
    setSaving(true);
    const { error } = await supabase.from("tests").insert({
      title: form.title,
      description: form.description || null,
      scheduled_at: form.scheduledAt || null,
      max_score: maxScoreNum,
      course_id: isUnassigned ? null : form.courseId,
      teacher_id: isUnassigned ? null : selectedCourse?.teacher_id || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Create failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Test created" });
    setForm({ title: "", description: "", scheduledAt: "", maxScore: "100", courseId: "" });
    fetchData();
  };

  const deleteTest = async (id: string) => {
    const { error } = await supabase.from("tests").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    fetchData();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not scheduled";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Tests
        </h2>
        <p className="text-muted-foreground">Admins can schedule upcoming tests; grading is teacher-only.</p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">New Test</h3>
              <p className="text-sm text-muted-foreground">Create an upcoming test</p>
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
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
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
            <Label>Course (assigns teacher automatically)</Label>
            <Select
              value={form.courseId}
              onValueChange={(v) => setForm({ ...form, courseId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Optional course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                    {c.teacher_name ? ` · ${c.teacher_name}` : ""}
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

      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Scheduled Tests</h3>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : tests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <GraduationCap className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No tests scheduled.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tests.map((t) => (
              <div key={t.id} className="p-4 border border-border/50 rounded-xl bg-muted/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{t.title}</p>
                    <p className="text-sm text-muted-foreground">{t.description || "No description"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(t.scheduled_at)} · Max {t.max_score}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.course_name || "Unassigned"}
                      {t.teacher_name ? ` · ${t.teacher_name}` : ""}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTest(t.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
