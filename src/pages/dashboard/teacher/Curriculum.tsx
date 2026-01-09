import { BookOpen, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeacherCurriculum() {
  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Curriculum
        </h2>
        <p className="text-muted-foreground">
          Manage lesson plans and course materials.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Lesson Plan</h3>
              <p className="text-sm text-muted-foreground">Create a new lesson</p>
            </div>
          </div>
          <Button variant="hero" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            New Lesson
          </Button>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Materials</h3>
              <p className="text-sm text-muted-foreground">Upload resources</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Upload
          </Button>
        </div>
      </div>

      {/* Current Curriculum */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Current Curriculum
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <BookOpen className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-center">No curriculum items yet.</p>
          <p className="text-sm text-center mt-1">
            Create lesson plans to organize your teaching.
          </p>
        </div>
      </div>
    </>
  );
}
