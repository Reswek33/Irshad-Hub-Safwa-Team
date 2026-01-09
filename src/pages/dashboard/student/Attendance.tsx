import { useEffect, useState } from "react";
import { Calendar, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns";

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  course_id: string;
}

export default function StudentAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState(new Date());
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAttendance();
    }
  }, [user]);

  const fetchAttendance = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", user?.id)
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance.",
        variant: "destructive",
      });
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case "absent":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "late":
        return <Clock className="w-5 h-5 text-secondary" />;
      case "excused":
        return <AlertTriangle className="w-5 h-5 text-accent" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const stats = {
    total: records.length,
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
  };

  const attendanceRate =
    stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getAttendanceForDay = (day: Date) => {
    return records.find((r) => isSameDay(parseISO(r.date), day));
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Attendance
        </h2>
        <p className="text-muted-foreground">View your attendance history.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Days</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Present</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{stats.present}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-destructive" />
            <span className="text-sm text-muted-foreground">Absent</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{stats.absent}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">Rate</span>
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{attendanceRate}%</p>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs text-muted-foreground font-medium py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: daysInMonth[0].getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {daysInMonth.map((day) => {
            const attendance = getAttendanceForDay(day);
            return (
              <div
                key={day.toISOString()}
                className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                  attendance
                    ? attendance.status === "present"
                      ? "bg-primary/20 text-primary"
                      : attendance.status === "absent"
                      ? "bg-destructive/20 text-destructive"
                      : "bg-secondary/20 text-secondary"
                    : "text-muted-foreground"
                }`}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Recent Attendance
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Calendar className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No attendance records yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                {getStatusIcon(record.status)}
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {format(parseISO(record.date), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === "present"
                      ? "bg-primary/10 text-primary"
                      : record.status === "absent"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-secondary/10 text-secondary"
                  }`}
                >
                  {getStatusLabel(record.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
