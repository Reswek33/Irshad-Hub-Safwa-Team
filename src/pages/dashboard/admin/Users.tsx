import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  GraduationCap,
  BookOpen,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  role: "admin" | "teacher" | "student";
  role_id: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    // Get all profiles
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_id, full_name, phone")
      .order("created_at", { ascending: false });

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Get all roles
    const { data: roles, error: roleError } = await supabase
      .from("user_roles")
      .select("id, user_id, role");

    if (roleError) {
      toast({
        title: "Error",
        description: "Failed to load roles.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Combine data
    const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
      const roleRecord = roles?.find((r) => r.user_id === profile.user_id);
      return {
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name,
        phone: profile.phone,
        role: (roleRecord?.role || "student") as "admin" | "teacher" | "student",
        role_id: roleRecord?.id || "",
      };
    });

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const updateRole = async (userId: string, newRole: "admin" | "teacher" | "student") => {
    setUpdating(userId);

    // Ensure a role row exists; upsert to be resilient to missing records.
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: newRole })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Role updated",
        description: `User role changed to ${newRole}.`,
      });
      fetchUsers();
    }

    setUpdating(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "teacher":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive";
      case "teacher":
        return "bg-secondary/10 text-secondary";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    teachers: users.filter((u) => u.role === "teacher").length,
    students: users.filter((u) => u.role === "student").length,
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          User Management
        </h2>
        <p className="text-muted-foreground">
          Manage users and their roles.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-destructive" />
            <span className="text-sm text-muted-foreground">Admins</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{stats.admins}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">Teachers</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{stats.teachers}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Students</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{stats.students}</p>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-foreground">
            All Users
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No users found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center text-primary-foreground font-semibold">
                  {user.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{user.full_name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.phone || "No phone"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(value: "admin" | "teacher" | "student") =>
                      updateRole(user.user_id, value)
                    }
                    disabled={updating === user.user_id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Student
                        </div>
                      </SelectItem>
                      <SelectItem value="teacher">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Teacher
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Admin
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
