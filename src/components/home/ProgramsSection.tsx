import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Users, Star } from "lucide-react";

const programs = [
  {
    title: "Hifz Program",
    arabicTitle: "برنامج الحفظ",
    description: "Complete Qur'an memorization with systematic juz-by-juz approach and daily revision.",
    duration: "2-4 Years",
    students: "100+",
    level: "All Levels",
    image: "🕌",
    featured: true,
  },
  {
    title: "Tajwid Course",
    arabicTitle: "دورة التجويد",
    description: "Master the rules of Qur'anic recitation with proper Makharij and characteristics.",
    duration: "1 Months",
    students: "30+",
    level: "Beginner",
    image: "📖",
    featured: false,
  },
  {
    title: "Islamic Studies",
    arabicTitle: "الدراسات الإسلامية",
    description: "Comprehensive study of Fiqh, Aqeedah, Seerah, and Islamic history.",
    duration: "1 Year",
    students: "100+",
    level: "Intermediate",
    image: "🌙",
    featured: false,
  },
  {
    title: "Arabic Language",
    arabicTitle: "اللغة العربية",
    description: "Learn classical Arabic to enable correct reading, understanding and interpretation.",
    duration: "1 Year",
    students: "10+",
    level: "Beginner",
    image: "✨",
    featured: false,
  },
];

const ProgramsSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background islamic-pattern">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-secondary text-sm font-medium mb-4">
              Our Programs
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Elevate Your{" "}
              <span className="text-gradient-gold">Knowledge</span>
            </h2>
          </div>
          <Link to="/programs">
            <Button variant="outline" className="group">
              View All Programs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {programs.map((program, index) => (
            <div
              key={program.title}
              className={`group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg ${
                program.featured ? "lg:row-span-2" : ""
              }`}
            >
              {program.featured && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gold text-secondary-foreground text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}
              
              <div className={`p-8 ${program.featured ? "lg:p-10" : ""}`}>
                {/* Icon/Image */}
                <div className={`text-6xl mb-6 ${program.featured ? "lg:text-8xl lg:mb-8" : ""}`}>
                  {program.image}
                </div>

                {/* Arabic Title */}
                <span className="font-arabic text-lg text-primary/70 block mb-2">
                  {program.arabicTitle}
                </span>

                {/* Title */}
                <h3 className={`font-display font-bold text-foreground mb-4 ${
                  program.featured ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl"
                }`}>
                  {program.title}
                </h3>

                {/* Description */}
                <p className={`text-muted-foreground mb-6 ${
                  program.featured ? "text-base lg:text-lg" : "text-sm lg:text-base"
                }`}>
                  {program.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    {program.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-secondary" />
                    {program.students} Students
                  </div>
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    {program.level}
                  </span>
                </div>

                {/* CTA */}
                <Link to={`/programs/${program.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Button
                    variant={program.featured ? "hero" : "outline"}
                    className="group/btn"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
