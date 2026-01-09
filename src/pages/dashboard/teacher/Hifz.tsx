import { useEffect, useMemo, useState } from "react";
import { BookOpen, Plus, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
}

interface StudentOption {
  user_id: string;
  full_name: string;
}

interface MemorizationRecord {
  id: string;
  student_id: string;
  surah_number: number;
  ayah_from: number;
  ayah_to: number;
  status: string;
  grade: string | null;
  notes: string | null;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "memorizing", label: "Memorizing" },
  { value: "memorized", label: "Memorized" },
  { value: "revision", label: "Revision" },
];

export default function TeacherHifz() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [records, setRecords] = useState<MemorizationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    courseId: "",
    studentId: "",
    surah: "1",
    ayahFrom: "1",
    ayahTo: "7",
    status: "memorizing",
    notes: "",
    grade: "",
  });

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  useEffect(() => {
    if (form.courseId) {
      fetchStudents(form.courseId);
    } else {
      setStudents([]);
      setForm((prev) => ({ ...prev, studentId: "" }));
    }
  }, [form.courseId]);

  useEffect(() => {
    if (form.studentId) {
      fetchRecords(form.studentId);
    } else {
      setRecords([]);
    }
  }, [form.studentId]);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("id, name")
      .eq("teacher_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load courses", variant: "destructive" });
      setLoading(false);
      return;
    }
    setCourses(data || []);
    setForm((prev) => ({ ...prev, courseId: data?.[0]?.id || "" }));
    setLoading(false);
  };

  const fetchStudents = async (courseId: string) => {
    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select("student_id")
      .eq("course_id", courseId);

    if (enrollError) {
      toast({ title: "Error", description: "Failed to load students", variant: "destructive" });
      return;
    }

    const studentIds = (enrollments || []).map((e) => e.student_id);
    if (studentIds.length === 0) {
      setStudents([]);
      setForm((prev) => ({ ...prev, studentId: "" }));
      return;
    }

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", studentIds);

    if (profileError) {
      toast({ title: "Error", description: "Failed to load profiles", variant: "destructive" });
      return;
    }

    setStudents(profiles || []);
    setForm((prev) => ({ ...prev, studentId: profiles?.[0]?.user_id || "" }));
  };

  const fetchRecords = async (studentId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("memorization_progress")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load progress", variant: "destructive" });
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  const saveRecord = async () => {
    if (!form.studentId || !form.courseId) {
      toast({ title: "Missing fields", description: "Select course and student", variant: "destructive" });
      return;
    }
    const ayahFromNum = Number(form.ayahFrom);
    const ayahToNum = Number(form.ayahTo);
    const surahNum = Number(form.surah);
    if (!surahNum || !ayahFromNum || !ayahToNum || ayahFromNum > ayahToNum) {
      toast({ title: "Invalid range", description: "Check surah and ayah range", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("memorization_progress").insert({
      student_id: form.studentId,
      surah_number: surahNum,
      ayah_from: ayahFromNum,
      ayah_to: ayahToNum,
      status: form.status,
      notes: form.notes || null,
      grade: form.grade || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Progress added" });
    setForm((prev) => ({ ...prev, notes: "", grade: "" }));
    fetchRecords(form.studentId);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("memorization_progress").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    fetchRecords(form.studentId);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary/10 text-primary";
      case "pending_review":
        return "bg-secondary/10 text-secondary";
      case "revision":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-muted text-foreground";
    }
  };

  const sortedStudents = useMemo(
    () => students.sort((a, b) => a.full_name.localeCompare(b.full_name)),
    [students]
  );

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Hifz Progress
        </h2>
        <p className="text-muted-foreground">Manage memorization entries for your enrolled students.</p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Course</Label>
            <Select
              value={form.courseId}
              onValueChange={(v) => setForm((prev) => ({ ...prev, courseId: v }))}
              disabled={courses.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={courses.length === 0 ? "No courses" : "Select course"} />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Student</Label>
            <Select
              value={form.studentId}
              onValueChange={(v) => setForm((prev) => ({ ...prev, studentId: v }))}
              disabled={sortedStudents.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={sortedStudents.length === 0 ? "No students" : "Select student"} />
              </SelectTrigger>
              <SelectContent>
                {sortedStudents.map((s) => (
                  <SelectItem key={s.user_id} value={s.user_id}>
                    {s.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm((prev) => ({ ...prev, status: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="space-y-2">
            <Label>Surah</Label>
            <Input
              type="number"
              min={1}
              value={form.surah}
              onChange={(e) => setForm((prev) => ({ ...prev, surah: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Ayah From</Label>
            <Input
              type="number"
              min={1}
              value={form.ayahFrom}
              onChange={(e) => setForm((prev) => ({ ...prev, ayahFrom: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Ayah To</Label>
            <Input
              type="number"
              min={1}
              value={form.ayahTo}
              onChange={(e) => setForm((prev) => ({ ...prev, ayahTo: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Grade (optional)</Label>
            <Input
              value={form.grade}
              onChange={(e) => setForm((prev) => ({ ...prev, grade: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label>Notes</Label>
          <Textarea
            placeholder="Teacher notes"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={saveRecord} disabled={saving || !form.studentId || !form.courseId}>
            <Plus className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Add Progress"}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">Recent Entries</h3>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading...</div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No entries yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div key={record.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {record.status === "completed" ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <Clock className="w-4 h-4 text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">Surah {record.surah_number}</p>
                  <p className="text-sm text-muted-foreground">
                    Ayah {record.ayah_from} - {record.ayah_to}
                  </p>
                  {record.notes && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{record.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(record.status)}`}>
                    {record.status.replace("_", " ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{record.grade || "--"}</p>
                  {record.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateStatus(record.id, "completed")}
                      className="mt-2"
                    >
                      Mark done
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
