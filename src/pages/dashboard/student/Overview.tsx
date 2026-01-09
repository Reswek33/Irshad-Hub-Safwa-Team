import {
  BookOpen,
  Calendar,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function StudentOverview() {
  const { profile, loading, getFirstName } = useUserProfile();
  const firstName = getFirstName(profile?.full_name || "Student");

  return (
    <>
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Assalamu Alaikum, {loading ? "..." : firstName}! 👋
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your Qur'anic journey.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">0</h3>
          <p className="text-sm text-muted-foreground">Juz' Memorized</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-secondary" />
            </div>
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">--</h3>
          <p className="text-sm text-muted-foreground">Attendance Rate</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">--</h3>
          <p className="text-sm text-muted-foreground">Test Average</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">1</h3>
          <p className="text-sm text-muted-foreground">Days Active</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border/50">
          <h3 className="font-display text-lg font-semibold text-foreground mb-6">
            Memorization Progress
          </h3>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">No memorization progress yet.</p>
            <p className="text-sm text-center mt-1">
              Your progress will appear here once you start.
            </p>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <h3 className="font-display text-lg font-semibold text-foreground mb-6">
            Upcoming
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Welcome to Irshad!</p>
                <p className="text-xs text-muted-foreground">Start your journey</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Explore Library</p>
                <p className="text-xs text-muted-foreground">Browse available resources</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Complete Profile</p>
                <p className="text-xs text-primary">Add more details</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
