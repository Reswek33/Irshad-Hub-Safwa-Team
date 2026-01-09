import { useEffect, useState } from "react";
import { GraduationCap, Plus, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
}

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);

    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "teacher");

    if (roleError) {
      toast({
        title: "Error",
        description: "Failed to load teachers.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (roleData && roleData.length > 0) {
      const userIds = roleData.map((r) => r.user_id);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, phone")
        .in("user_id", userIds);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load teachers.",
          variant: "destructive",
        });
      } else {
        setTeachers(profileData || []);
      }
    } else {
      setTeachers([]);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Teachers Management
        </h2>
        <p className="text-muted-foreground">
          View and manage all teachers (Ustaz/Ustazah).
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">Total Teachers</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{teachers.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Active Classes</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">--</p>
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-foreground">
            All Teachers
          </h3>
          <p className="text-sm text-muted-foreground">
            Promote users to teacher in Users section
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : teachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <GraduationCap className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No teachers yet.</p>
            <p className="text-sm text-center mt-1">
              Promote users to teacher role in the Users section.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-secondary-foreground font-semibold">
                  {teacher.full_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{teacher.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {teacher.phone || "No phone"}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                  Ustaz
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
