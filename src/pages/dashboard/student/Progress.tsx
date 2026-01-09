import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, Clock, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MemorizationRecord {
  id: string;
  surah_number: number;
  ayah_from: number;
  ayah_to: number;
  status: string;
  grade: string | null;
  notes: string | null;
  created_at: string;
}

const SURAHS = [
  { number: 1, name: "Al-Fatiha", verses: 7 },
  { number: 114, name: "An-Nas", verses: 6 },
  { number: 113, name: "Al-Falaq", verses: 5 },
  { number: 112, name: "Al-Ikhlas", verses: 4 },
  { number: 111, name: "Al-Masad", verses: 5 },
  { number: 110, name: "An-Nasr", verses: 3 },
];

export default function StudentProgress() {
  const [records, setRecords] = useState<MemorizationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("memorization_progress")
      .select("*")
      .eq("student_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load progress.",
        variant: "destructive",
      });
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-secondary" />;
      default:
        return <BookOpen className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return "text-muted-foreground";
    if (grade === "A" || grade === "Excellent") return "text-primary";
    if (grade === "B" || grade === "Good") return "text-secondary";
    return "text-foreground";
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          My Progress
        </h2>
        <p className="text-muted-foreground">
          View-only: your teacher records Hifz milestones for you.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Entries</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {records.length}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {records.filter((r) => r.status === "completed").length}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">In Progress</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {records.filter((r) => r.status === "in_progress").length}
          </p>
        </div>
      </div>

      {/* Records */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Memorization Records
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No memorization records yet.</p>
            <p className="text-sm text-center mt-1">
              Your teacher will add your progress here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => {
              const surah = SURAHS.find(
                (s) => s.number === record.surah_number
              );
              return (
                <div
                  key={record.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getStatusIcon(record.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">
                      Surah {surah?.name || record.surah_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ayah {record.ayah_from} - {record.ayah_to}
                    </p>
                    {record.notes && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {record.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${getGradeColor(record.grade)}`}
                    >
                      {record.grade || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {record.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
