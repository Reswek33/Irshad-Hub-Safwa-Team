import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden islamic-pattern">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      
      {/* Floating Geometric Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-primary/10 rounded-full animate-float opacity-50" />
      <div className="absolute bottom-40 right-20 w-24 h-24 border border-gold/20 rotate-45 animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-gradient-to-br from-gold/10 to-gold/5 rounded-lg rotate-12 animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Arabic Calligraphy Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8 animate-fade-in">
            <span className="font-arabic text-lg text-primary">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 animate-fade-in-up leading-tight">
            lighting Your Path with{" "}
            <span className="text-gradient-emerald">Qur'anic</span>{" "}
            <span className="text-gradient-gold">Knowledge</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Join Irshad at KJUMJ for comprehensive Qur'an memorization, 
            Tajwid mastery, and Islamic education in a nurturing environment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link to="/register">
              <Button variant="hero" size="xl" className="group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/programs">
              <Button variant="outline" size="xl">
                Explore Programs
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="glass-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:glow-emerald">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-emerald" />
              </div>
              <h3 className="font-display text-3xl font-bold text-foreground mb-1">150+</h3>
              <p className="text-sm text-muted-foreground">Active Students</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:glow-gold">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-3xl font-bold text-foreground mb-1">50+</h3>
              <p className="text-sm text-muted-foreground">Juz' Memorized</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:glow-emerald">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-emerald" />
              </div>
              <h3 className="font-display text-3xl font-bold text-foreground mb-1">50+</h3>
              <p className="text-sm text-muted-foreground">Qualified Teachers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-muted/50 to-transparent" />
    </section>
  );
};

export default HeroSection;
