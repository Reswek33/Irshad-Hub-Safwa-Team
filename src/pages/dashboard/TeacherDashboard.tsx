import {
  Users,
  Calendar,
  ClipboardList,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import TeacherStudents from "./teacher/Students";
import TeacherAttendance from "./teacher/Attendance";
import TeacherTests from "./teacher/Tests";
import TeacherHifz from "./teacher/Hifz";
import TeacherAnnouncements from "./teacher/Announcements";

const menuItems = [
  { icon: Users, label: "My Students", to: "/dashboard/teacher" },
  { icon: Calendar, label: "Attendance", to: "/dashboard/teacher/attendance" },
  { icon: ClipboardList, label: "Tests", to: "/dashboard/teacher/tests" },
  { icon: BookOpen, label: "Hifz Progress", to: "/dashboard/teacher/hifz" },
  {
    icon: MessageSquare,
    label: "Announcements",
    to: "/dashboard/teacher/announcements",
  },
];

const TeacherDashboard = () => {
  return (
    <DashboardLayout
      menuItems={menuItems}
      roleLabel="Teacher"
      avatarGradient="from-gold to-gold-light"
    >
      <Routes>
        <Route index element={<TeacherStudents />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="tests" element={<TeacherTests />} />
        <Route path="hifz" element={<TeacherHifz />} />
        <Route path="announcements" element={<TeacherAnnouncements />} />
        <Route
          path="*"
          element={<Navigate to="/dashboard/teacher" replace />}
        />
      </Routes>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
