import { useState, useEffect } from "react";
import { GraduationCap, FileText, Award, TrendingUp, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Test {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string | null;
  max_score: number;
  course_id: string | null;
}

interface TestResult {
  id: string;
  test_id: string;
  score: number | null;
  grade: string | null;
  feedback: string | null;
  submitted_at: string;
  tests: Test;
}

export default function StudentTests() {
  const { user } = useAuth();
  const [upcomingTests, setUpcomingTests] = useState<Test[]>([]);
  const [pastResults, setPastResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ testsTaken: 0, avgScore: 0 });

  useEffect(() => {
    if (user) {
      fetchTests();
    }
  }, [user]);

  const fetchTests = async () => {
    setLoading(true);
    const now = new Date().toISOString();

    // Fetch enrolled course IDs for this student
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("student_id", user?.id);

    const courseIds = (enrollments || []).map((e) => e.course_id);

    let upcoming: Test[] | null = [];
    if (courseIds.length > 0) {
      const { data: upcomingData, error: upcomingError } = await supabase
        .from("tests")
        .select("*")
        .gte("scheduled_at", now)
        .in("course_id", courseIds)
        .order("scheduled_at", { ascending: true });

      if (upcomingError) {
        // eslint-disable-next-line no-console
        console.error(upcomingError);
      }
      upcoming = upcomingData || [];
    }

    setUpcomingTests(upcoming || []);

    const { data: results } = await supabase
      .from("test_results")
      .select("*, tests(*)")
      .eq("student_id", user?.id)
      .order("submitted_at", { ascending: false });

    setPastResults(results || []);

    if (results && results.length > 0) {
      const scoresOnly = results.filter((r) => r.score !== null);
      const avgScore =
        scoresOnly.length > 0
          ? Math.round(
              scoresOnly.reduce((sum, r) => sum + (r.score || 0), 0) /
                scoresOnly.length
            )
          : 0;
      setStats({ testsTaken: results.length, avgScore });
    }

    setLoading(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return "text-muted-foreground";
    const g = grade.toUpperCase();
    if (g === "A" || g === "A+") return "text-emerald-500";
    if (g === "B" || g === "B+") return "text-blue-500";
    if (g === "C" || g === "C+") return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Tests & Evaluations
        </h2>
        <p className="text-muted-foreground">
          View your test results and upcoming evaluations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Tests Taken</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {stats.testsTaken}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">Average Score</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {stats.avgScore > 0 ? `${stats.avgScore}%` : "--"}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Upcoming</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">
            {upcomingTests.length}
          </p>
        </div>
      </div>

      {/* Upcoming Tests */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Upcoming Tests
        </h3>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : upcomingTests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <GraduationCap className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No upcoming tests scheduled.</p>
            <p className="text-sm text-center mt-1">
              Your teacher will schedule tests when you're ready.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/30"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{test.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {test.description || "No description"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {formatDate(test.scheduled_at)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max: {test.max_score} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Tests */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Past Results
        </h3>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : pastResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No test results yet.</p>
            <p className="text-sm text-center mt-1">
              Your results will appear here after evaluations.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/30"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {result.tests?.title || "Test"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.feedback || "No feedback provided"}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${getGradeColor(result.grade)}`}>
                    {result.grade || "--"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.score !== null
                      ? `${result.score}/${result.tests?.max_score || 100}`
                      : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
