import { BookOpen, Calendar, MessageSquare, Award, Library, BarChart3 } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Qur'an Memorization",
    description: "Structured Hifz programs with personalized tracking and guidance from experienced Huffaz.",
    color: "emerald",
  },
  {
    icon: Award,
    title: "Tajwid Mastery",
    description: "Interactive lessons with audio examples to perfect your Qur'anic recitation.",
    color: "gold",
  },
  {
    icon: Calendar,
    title: "Attendance Tracking",
    description: "Smart attendance system with automated reminders to keep you on track.",
    color: "accent",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track your memorization journey with detailed progress insights and milestones.",
    color: "emerald",
  },
  {
    icon: Library,
    title: "Digital Library",
    description: "Access Islamic books, Tafsir, and resources anytime with easy borrowing system.",
    color: "gold",
  },
  {
    icon: MessageSquare,
    title: "Community Forum",
    description: "Connect with fellow students and teachers through discussions and announcements.",
    color: "accent",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="text-gradient-emerald">Excel</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive tools and resources designed to support your Qur'anic education journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
                  feature.color === "emerald"
                    ? "bg-gradient-to-br from-emerald/20 to-emerald/10"
                    : feature.color === "gold"
                    ? "bg-gradient-to-br from-gold/20 to-gold/10"
                    : "bg-gradient-to-br from-accent/20 to-accent/10"
                }`}
              >
                <feature.icon
                  className={`w-7 h-7 ${
                    feature.color === "emerald"
                      ? "text-primary"
                      : feature.color === "gold"
                      ? "text-secondary"
                      : "text-accent"
                  }`}
                />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
