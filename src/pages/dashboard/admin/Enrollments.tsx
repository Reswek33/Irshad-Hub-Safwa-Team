import { useEffect, useState } from "react";
import { Link2, Users, BookOpen, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentOption {
  user_id: string;
  full_name: string;
}

interface CourseOption {
  id: string;
  name: string;
  teacher_id: string | null;
  teacher_name?: string | null;
}

interface EnrollmentRow {
  id: string;
  student_id: string;
  course_id: string;
  student_name: string;
  course_name: string;
  teacher_name: string | null;
}

export default function AdminEnrollments() {
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ studentId: "", courseId: "" });

  useEffect(() => {
    fetchOptions();
    fetchEnrollments();
  }, []);

  const fetchOptions = async () => {
    setLoading(true);
    const [studentsRes, coursesRes, teachersRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, full_name")
        .in(
          "user_id",
          (
            await supabase
              .from("user_roles")
              .select("user_id")
              .eq("role", "student")
          ).data?.map((r) => r.user_id) || []
        ),
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
    ]);

    if (!studentsRes.error) {
      setStudents(studentsRes.data || []);
    }

    if (!coursesRes.error) {
      const teacherMap: Record<string, string> = {};
      if (!teachersRes.error && teachersRes.data) {
        teachersRes.data.forEach((t) => {
          teacherMap[t.user_id] = t.full_name;
        });
      }
      const mapped = (coursesRes.data || []).map((c) => ({
        ...c,
        teacher_name: c.teacher_id ? teacherMap[c.teacher_id] || null : null,
      }));
      setCourses(mapped);
    }
    setLoading(false);
  };

  const fetchEnrollments = async () => {
    // Load raw enrollments
    const { data: enrollRows, error: enrollError } = await supabase
      .from("enrollments")
      .select("id, student_id, course_id")
      .order("enrolled_at", { ascending: false });

    if (enrollError) {
      toast({ title: "Error", description: "Failed to load enrollments", variant: "destructive" });
      return;
    }

    const studentIds = Array.from(new Set((enrollRows || []).map((r) => r.student_id)));
    const courseIds = Array.from(new Set((enrollRows || []).map((r) => r.course_id)));

    // Load student names
    const { data: studentProfiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", studentIds);
    const studentMap: Record<string, string> = {};
    (studentProfiles || []).forEach((p) => {
      studentMap[p.user_id] = p.full_name;
    });

    // Load course names and teacher ids
    const { data: courseRows } = await supabase
      .from("courses")
      .select("id, name, teacher_id")
      .in("id", courseIds);
    const courseMap: Record<string, { name: string; teacher_id: string | null }> = {};
    const teacherIds = new Set<string>();
    (courseRows || []).forEach((c) => {
      courseMap[c.id] = { name: c.name, teacher_id: c.teacher_id };
      if (c.teacher_id) teacherIds.add(c.teacher_id);
    });

    // Load teacher names
    const teacherMap: Record<string, string> = {};
    if (teacherIds.size > 0) {
      const { data: teacherProfiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", Array.from(teacherIds));
      (teacherProfiles || []).forEach((t) => {
        teacherMap[t.user_id] = t.full_name;
      });
    }

    const mapped: EnrollmentRow[] = (enrollRows || []).map((row) => {
      const courseInfo = courseMap[row.course_id] || { name: "Course", teacher_id: null };
      return {
        id: row.id as string,
        student_id: row.student_id as string,
        course_id: row.course_id as string,
        student_name: studentMap[row.student_id] || "Student",
        course_name: courseInfo.name,
        teacher_name: courseInfo.teacher_id ? teacherMap[courseInfo.teacher_id] || null : null,
      };
    });
    setEnrollments(mapped);
  };

  const createEnrollment = async () => {
    if (!form.studentId || !form.courseId) {
      toast({ title: "Missing fields", description: "Select student and course", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("enrollments").upsert(
      { student_id: form.studentId, course_id: form.courseId },
      { onConflict: "student_id,course_id" }
    );
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Enrolled", description: "Student enrolled to course" });
    fetchEnrollments();
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Enrollments
        </h2>
        <p className="text-muted-foreground">
          Enroll students into courses and ensure each course has a teacher for Hifz tracking.
        </p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Link2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Create Enrollment</h3>
              <p className="text-sm text-muted-foreground">Student → Course (with assigned teacher)</p>
            </div>
          </div>
          <Button onClick={createEnrollment} disabled={saving || loading}>
            {saving ? "Saving..." : "Enroll"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Student</p>
            <Select
              value={form.studentId}
              onValueChange={(v) => setForm((prev) => ({ ...prev, studentId: v }))}
              disabled={students.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={students.length === 0 ? "No students" : "Select student"} />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.user_id} value={s.user_id}>
                    {s.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Course</p>
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
                    {c.teacher_name ? ` · ${c.teacher_name}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">Current Enrollments</h3>
        </div>

        {enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No enrollments yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center text-primary-foreground font-semibold">
                  {enrollment.student_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{enrollment.student_name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {enrollment.course_name}
                    {enrollment.teacher_name ? ` · ${enrollment.teacher_name}` : ""}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  Course
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
