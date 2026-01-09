import { useEffect, useMemo, useState } from "react";
import { CheckCircle, XCircle, Clock, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

interface Student {
  id: string;
  full_name: string;
  user_id: string;
}

interface CourseOption {
  id: string;
  name: string;
  teacher_id: string | null;
}

export default function TeacherAttendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      setAttendance({});
      setLoading(false);
      return;
    }
    fetchData(selectedCourse);
  }, [selectedCourse]);

  const fetchCourses = async () => {
    setLoading(true);

    const { data: courseData, error } = await supabase
      .from("courses")
      .select("id, name, teacher_id")
      .eq("teacher_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load courses.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setCourses(courseData || []);
    if (courseData && courseData.length > 0) {
      setSelectedCourse((prev) => prev || courseData[0].id);
    } else {
      setSelectedCourse("");
      setLoading(false);
    }
  };

  const fetchData = async (courseId: string) => {
    setLoading(true);

    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select("student_id")
      .eq("course_id", courseId);

    if (enrollError) {
      toast({
        title: "Error",
        description: "Failed to load students.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const userIds = (enrollments || []).map((e) => e.student_id);

    if (userIds.length === 0) {
      setStudents([]);
      setAttendance({});
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, user_id")
      .in("user_id", userIds);

    if (profileError || !profileData) {
      toast({
        title: "Error",
        description: "Failed to load student profiles.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setStudents(profileData);

    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("student_id, status")
      .eq("date", today)
      .eq("course_id", courseId)
      .in(
        "student_id",
        profileData.map((s) => s.user_id)
      );

    if (attendanceError) {
      toast({
        title: "Error",
        description: "Failed to load attendance.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (attendanceData) {
      const attendanceMap: Record<string, string> = {};
      attendanceData.forEach((a) => {
        attendanceMap[a.student_id] = a.status;
      });
      setAttendance(attendanceMap);
    }

    setLoading(false);
  };

  const handleStatusChange = (studentUserId: string, status: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentUserId]: status,
    }));
  };

  const saveAttendance = async () => {
    setSaving(true);

    if (!selectedCourse) {
      toast({
        title: "Select a course",
        description: "Please choose a course first.",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    const records = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: studentId,
      course_id: selectedCourse,
      date: today,
      status,
    }));

    const { error } = await supabase.from("attendance").upsert(records, {
      onConflict: "student_id,date,course_id",
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    toast({
      title: "Saved!",
      description: "Attendance has been recorded.",
    });
    setSaving(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "late":
        return <Clock className="w-4 h-4 text-secondary" />;
      default:
        return null;
    }
  };

  const stats = useMemo(
    () => ({
      present: Object.values(attendance).filter((s) => s === "present").length,
      absent: Object.values(attendance).filter((s) => s === "absent").length,
      late: Object.values(attendance).filter((s) => s === "late").length,
    }),
    [attendance]
  );

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Take Attendance
        </h2>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Course selector + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Course</span>
          </div>
          <Select
            value={selectedCourse}
            onValueChange={(value) => setSelectedCourse(value)}
            disabled={courses.length === 0}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  courses.length === 0 ? "No courses" : "Select course"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Present</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {stats.present}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-destructive" />
            <span className="text-sm text-muted-foreground">Absent</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {stats.absent}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">Late</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {stats.late}
          </p>
        </div>
      </div>

      {/* Attendance Form */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Mark Attendance
          </h3>
          <Button
            onClick={saveAttendance}
            disabled={saving || students.length === 0 || !selectedCourse}
          >
            {saving ? "Saving..." : "Save Attendance"}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No students to mark attendance for.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center text-primary-foreground font-semibold">
                  {student.full_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {student.full_name}
                  </p>
                </div>
                <Select
                  value={attendance[student.user_id] || ""}
                  onValueChange={(value) =>
                    handleStatusChange(student.user_id, value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Present
                      </div>
                    </SelectItem>
                    <SelectItem value="absent">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-destructive" />
                        Absent
                      </div>
                    </SelectItem>
                    <SelectItem value="late">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-secondary" />
                        Late
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
