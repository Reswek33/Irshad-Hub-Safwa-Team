import {
  TrendingUp,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Library,
  MessageSquare,
  Settings,
  ClipboardList,
  Link2,
} from "lucide-react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import AdminOverview from "./admin/Overview";
import AdminUsers from "./admin/Users";
import AdminTeachers from "./admin/Teachers";
import AdminPrograms from "./admin/Programs";
import AdminSettings from "./admin/Settings";
import AdminTests from "./admin/Tests";
import AdminEnrollments from "./admin/Enrollments";

const menuItems = [
  { icon: TrendingUp, label: "Overview", to: "/dashboard/admin" },
  { icon: Users, label: "Users", to: "/dashboard/admin/users" },
  { icon: GraduationCap, label: "Teachers", to: "/dashboard/admin/teachers" },
  { icon: BookOpen, label: "Programs", to: "/dashboard/admin/programs" },
  { icon: Link2, label: "Enrollments", to: "/dashboard/admin/enrollments" },
  { icon: ClipboardList, label: "Tests", to: "/dashboard/admin/tests" },
  { icon: Calendar, label: "Attendance", to: "/dashboard/admin/attendance" },
  { icon: Library, label: "Library", to: "/library" },
  {
    icon: MessageSquare,
    label: "Announcements",
    to: "/dashboard/admin/announcements",
  },
  { icon: Settings, label: "Settings", to: "/dashboard/admin/settings" },
];

function AttendancePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
      <Calendar className="w-12 h-12 mb-4 opacity-50" />
      <p className="text-center font-medium">Attendance Reports</p>
      <p className="text-sm text-center mt-1">
        View attendance analytics across all classes.
      </p>
    </div>
  );
}

function AnnouncementsPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
      <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
      <p className="text-center font-medium">System Announcements</p>
      <p className="text-sm text-center mt-1">
        Broadcast messages to all users.
      </p>
    </div>
  );
}

const AdminDashboard = () => {
  return (
    <DashboardLayout menuItems={menuItems} roleLabel="Administrator">
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="programs" element={<AdminPrograms />} />
        <Route path="enrollments" element={<AdminEnrollments />} />
        <Route path="tests" element={<AdminTests />} />
        <Route path="attendance" element={<AttendancePlaceholder />} />
        <Route path="announcements" element={<AnnouncementsPlaceholder />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
