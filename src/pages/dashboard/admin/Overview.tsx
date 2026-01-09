import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Library,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalResources: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      const [studentsRes, teachersRes, coursesRes, resourcesRes] =
        await Promise.all([
          supabase
            .from("user_roles")
            .select("*", { count: "exact", head: true })
            .eq("role", "student"),
          supabase
            .from("user_roles")
            .select("*", { count: "exact", head: true })
            .eq("role", "teacher"),
          supabase.from("courses").select("*", { count: "exact", head: true }),
          supabase
            .from("library_resources")
            .select("*", { count: "exact", head: true }),
        ]);

      const anyError = [
        studentsRes.error,
        teachersRes.error,
        coursesRes.error,
        resourcesRes.error,
      ].find(Boolean);
      if (anyError) {
        toast({
          title: "Failed to load stats",
          description: anyError?.message,
          variant: "destructive",
        });
      }

      setStats({
        totalStudents: studentsRes.count || 0,
        totalTeachers: teachersRes.count || 0,
        totalCourses: coursesRes.count || 0,
        totalResources: resourcesRes.count || 0,
      });
    };

    fetchStats();
  }, [toast]);

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Irshad Management Overview 🏛️
        </h2>
        <p className="text-muted-foreground">
          Monitor and manage all aspects of Irshad operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            {stats.totalStudents > 0 && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                Active
              </span>
            )}
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            {stats.totalStudents}
          </h3>
          <p className="text-sm text-muted-foreground">Total Students</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            {stats.totalTeachers}
          </h3>
          <p className="text-sm text-muted-foreground">Active Teachers</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            {stats.totalCourses}
          </h3>
          <p className="text-sm text-muted-foreground">Active Programs</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center">
              <Library className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            {stats.totalResources}
          </h3>
          <p className="text-sm text-muted-foreground">Library Resources</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <h3 className="font-display text-lg font-semibold text-foreground mb-6">
            Recent Activity
          </h3>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No recent activity yet.</p>
            <p className="text-sm text-center mt-1">
              Activity will appear here as users interact with the system.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald/10 to-emerald/5 rounded-2xl p-6 border border-emerald/20">
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Welcome to Irshad Admin
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your admin panel is ready. Start by adding teachers and creating
            programs for your students.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✓ Manage users and roles</p>
            <p>✓ Create and edit programs</p>
            <p>✓ Monitor attendance</p>
            <p>✓ Manage library resources</p>
          </div>
        </div>
      </div>
    </>
  );
}
