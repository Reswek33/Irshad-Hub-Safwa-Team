import { MessageSquare, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeacherAnnouncements() {
  return (
    <>
      <div className="mb-8">
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Announcements
        </h2>
        <p className="text-muted-foreground">
          Send updates to your students.
        </p>
      </div>

      {/* Quick Post */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          New Announcement
        </h3>
        <textarea
          className="w-full h-32 p-4 rounded-lg bg-muted/50 border border-border/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
          placeholder="Write your announcement..."
        />
        <div className="flex justify-end mt-4">
          <Button variant="hero">
            <Send className="w-4 h-4 mr-2" />
            Post
          </Button>
        </div>
      </div>

      {/* Past Announcements */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Recent Announcements
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-center">No announcements yet.</p>
          <p className="text-sm text-center mt-1">
            Your announcements will appear here.
          </p>
        </div>
      </div>
    </>
  );
}
