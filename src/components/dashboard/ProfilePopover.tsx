import { useState } from "react";
import { User, Settings, LogOut, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";

export function ProfilePopover() {
  const [open, setOpen] = useState(false);
  const { signOut, role } = useAuth();
  const { profile, loading, getInitials } = useUserProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setOpen(false);
  };

  const displayName = profile?.full_name || "User";
  const initials = getInitials(displayName);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-muted">
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        {/* Profile Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center text-primary-foreground font-semibold text-lg">
              {loading ? "..." : initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {loading ? "Loading..." : displayName}
              </p>
              <p className="text-sm text-muted-foreground capitalize">{role}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {role === "admin" && (
            <button
              onClick={() => {
                navigate(`/dashboard/admin/settings`);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Profile Settings</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>
          )}
        </div>

        {/* Sign Out */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
