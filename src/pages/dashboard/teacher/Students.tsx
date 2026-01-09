import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";

interface Student {
  id: string;
  full_name: string;
  user_id: string;
}

export default function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile, loading: profileLoading, getFirstName } = useUserProfile();
  const firstName = getFirstName(profile?.full_name || "Teacher");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);

    // Get all students (users with student role)
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "student");

    if (roleError) {
      toast({
        title: "Error",
        description: "Failed to load students.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!roleData || roleData.length === 0) {
      setStudents([]);
      setLoading(false);
      return;
    }

    const userIds = roleData.map((r) => r.user_id);

    // Get profiles for these users
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, user_id")
      .in("user_id", userIds);

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to load student profiles.",
        variant: "destructive",
      });
    } else {
      setStudents(profileData || []);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Assalamu Alaikum, {profileLoading ? "..." : firstName}! 📚
        </h2>
        <p className="text-muted-foreground">
          Manage your classes and track student progress.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Students</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{students.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Present Today</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">--</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-destructive" />
            <span className="text-sm text-muted-foreground">Absent Today</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">--</p>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-foreground">
            My Students
          </h3>
          <Button variant="outline" size="sm">
            Mark Attendance
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No students enrolled yet.</p>
            <p className="text-sm text-center mt-1">
              Students will appear here once assigned to your class.
            </p>
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
                  <p className="font-medium text-foreground">{student.full_name}</p>
                  <p className="text-sm text-muted-foreground">Student</p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
