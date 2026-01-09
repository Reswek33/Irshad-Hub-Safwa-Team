import { useCallback, useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Course {
  id: string;
  name: string;
  description: string | null;
  schedule: string | null;
  teacher_id: string | null;
  created_at: string;
}

interface TeacherOption {
  user_id: string;
  full_name: string;
}

export default function AdminPrograms() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [programLoading, setProgramLoading] = useState(true);
  const [teacherLoading, setTeacherLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    schedule: "",
    teacherId: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching courses:", error);
        } else {
          setCourses(data || []);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setProgramLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "teacher");

        const teacherIds = roles?.map((r) => r.user_id) || [];
        if (teacherIds.length === 0) {
          setTeachers([]);
          return;
        }

        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", teacherIds);

        setTeachers(profiles || []);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setTeacherLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a program name.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const teacherIdDb =
      formData.teacherId && formData.teacherId !== "unassigned"
        ? formData.teacherId
        : null;

    if (editingId) {
      const { error } = await supabase
        .from("courses")
        .update({
          name: formData.name,
          description: formData.description || null,
          schedule: formData.schedule || null,
          teacher_id: teacherIdDb,
        })
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update program.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Updated", description: "Program updated." });
        setDialogOpen(false);
        setEditingId(null);
        setFormData({ name: "", description: "", schedule: "", teacherId: "" });
        setCourses((prev) =>
          prev.map((course) =>
            course.id === editingId
              ? {
                  ...course,
                  name: formData.name,
                  description: formData.description || null,
                  schedule: formData.schedule || null,
                  teacher_id: teacherIdDb,
                }
              : course
          )
        );
      }
    } else {
      const { error } = await supabase.from("courses").insert({
        name: formData.name,
        description: formData.description || null,
        schedule: formData.schedule || null,
        teacher_id: teacherIdDb,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create program.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Program created successfully.",
        });
        setFormData({ name: "", description: "", schedule: "", teacherId: "" });
        setDialogOpen(false);
        setCourses((prev) => [
          {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            description: formData.description || null,
            schedule: formData.schedule || null,
            teacher_id: teacherIdDb,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    }

    setSaving(false);
  };

  const deleteProgram = async (id: string) => {
    if (!window.confirm("Delete this program? This cannot be undone.")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete program.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Program has been removed.",
      });
      setCourses((prev) => prev.filter((course) => course.id !== id));
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Programs
        </h2>
        <p className="text-muted-foreground">
          Manage Qur'anic education programs.
        </p>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? "Edit Program" : "New Program"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Program" : "Create New Program"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Hifz Program"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Teacher (optional)</Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, teacherId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {teachers.map((t) => (
                      <SelectItem key={t.user_id} value={t.user_id}>
                        {t.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the program..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Input
                  id="schedule"
                  placeholder="e.g., Mon-Fri 8:00 AM - 12:00 PM"
                  value={formData.schedule}
                  onChange={(e) =>
                    setFormData({ ...formData, schedule: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Create Program"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Programs List */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">
          All Programs
        </h3>

        {programLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No programs yet.</p>
            <p className="text-sm text-center mt-1">
              Create your first program to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{course.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {course.schedule || "No schedule set"}
                  </p>
                  {course.teacher_id && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Teacher:{" "}
                      {teachers.find((t) => t.user_id === course.teacher_id)
                        ?.full_name || course.teacher_id}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingId(course.id);
                      setFormData({
                        name: course.name,
                        description: course.description || "",
                        schedule: course.schedule || "",
                        teacherId: course.teacher_id || "",
                      });
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteProgram(course.id)}
                  >
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
