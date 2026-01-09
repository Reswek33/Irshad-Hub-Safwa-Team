import {
  BarChart3,
  BookOpen,
  Calendar,
  GraduationCap,
  Library,
  MessageSquare,
} from "lucide-react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import StudentOverview from "./student/Overview";
import StudentProgress from "./student/Progress";
import StudentAttendance from "./student/Attendance";
import StudentTests from "./student/Tests";
import LibraryPage from "@/pages/Library";

const menuItems = [
  { icon: BarChart3, label: "Overview", to: "/dashboard/student" },
  { icon: BookOpen, label: "My Progress", to: "/dashboard/student/progress" },
  { icon: Calendar, label: "Attendance", to: "/dashboard/student/attendance" },
  { icon: GraduationCap, label: "Tests", to: "/dashboard/student/tests" },
  { icon: Library, label: "Library", to: "/library" },
  { icon: MessageSquare, label: "Forum", to: "/dashboard/student/forum" },
];

const StudentDashboard = () => {
  return (
    <DashboardLayout menuItems={menuItems} roleLabel="Student">
      <Routes>
        <Route index element={<StudentOverview />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="tests" element={<StudentTests />} />
        <Route path="forum" element={<ForumPlaceholder />} />
        <Route path="*" element={<Navigate to="/dashboard/student" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

function ForumPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
      <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
      <p className="text-center font-medium">Forum Coming Soon</p>
      <p className="text-sm text-center mt-1">
        Connect with fellow students and teachers.
      </p>
    </div>
  );
}

export default StudentDashboard;
