import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Users, Star, ArrowRight, CheckCircle } from "lucide-react";

const programs = [
  {
    id: "hifz",
    title: "Hifz Program",
    arabicTitle: "برنامج الحفظ",
    description: "Complete Qur'an memorization with systematic juz-by-juz approach, weekly revision sessions, and personalized guidance from experienced Huffaz.",
    duration: "2-4 Years",
    students: "100+",
    level: "All Levels",
    image: "🕌",
    features: [
      "Structured juz-by-juz memorization",
      "Weekly revision sessions",
      "One-on-one recitation with teachers",
      "Weekly assessments",
      "Certificate upon completion",
    ],
    featured: true,
  },
  {
    id: "tajwid",
    title: "Tajwid Course",
    arabicTitle: "دورة التجويد",
    description: "Master the art of Qur'anic recitation with proper Makharij, characteristics of letters, and all essential Tajwid rules.",
    duration: "1 Months",
    students: "30+",
    level: "Beginner",
    image: "📖",
    features: [
      "Makharij al-Huruf (articulation points)",
      "Sifat al-Huruf (letter characteristics)",
      "Rules of Noon and Meem",
      "Audio examples and practice",
      "Interactive exercises",
    ],
    featured: false,
  },
  {
    id: "islamic-studies",
    title: "Islamic Studies",
    arabicTitle: "الدراسات الإسلامية",
    description: "Comprehensive study of essential Islamic sciences including Fiqh, Aqeedah, Seerah, and Islamic history.",
    duration: "1 Year",
    students: "100+",
    level: "Intermediate",
    image: "🌙",
    features: [
      "Fiqh (Islamic Jurisprudence)",
      "Aqeedah (Islamic Creed)",
      "Seerah (Prophetic Biography)",
      "Islamic History",
      "Contemporary Issues",
    ],
    featured: false,
  },
  {
    id: "arabic",
    title: "Arabic Language",
    arabicTitle: "اللغة العربية",
    description: "Learn classical Arabic to understand the Qur'an directly, focusing on grammar, vocabulary, and comprehension.",
    duration: "1 Year",
    students: "10+",
    level: "Beginner",
    image: "✨",
    features: [
      "Arabic Alphabet & Reading",
      "Nahw (Grammar)",
      "Sarf (Morphology)",
      "Vocabulary Building",
      "Qur'anic Arabic Focus",
    ],
    featured: false,
  },
];

const Programs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-10 lg:py-10 bg-gradient-to-b from-background to-muted/30 islamic-pattern">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-secondary text-sm font-medium mb-6">
                Our Programs
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Choose Your Path to{" "}
                <span className="text-gradient-gold">Knowledge</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our comprehensive programs designed to guide you through every stage of your Qur'anic education journey.
              </p>
            </div>
          </div>
        </section>

        {/* Programs List */}
        <section className="py-20 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="space-y-8">
              {programs.map((program, index) => (
                <div
                  key={program.id}
                  className={`bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    program.featured ? "ring-2 ring-gold/30" : ""
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    {/* Left - Info */}
                    <div className="lg:col-span-2 p-8 lg:p-10">
                      {program.featured && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-secondary text-xs font-semibold mb-4">
                          <Star className="w-3 h-3" />
                          Most Popular
                        </div>
                      )}

                      <div className="flex items-start gap-6 mb-6">
                        <div className="text-6xl">{program.image}</div>
                        <div>
                          <span className="font-arabic text-lg text-primary/70 block mb-1">
                            {program.arabicTitle}
                          </span>
                          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                            {program.title}
                          </h2>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6 text-lg">
                        {program.description}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 mb-8">
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

                      <Link to="/register">
                        <Button variant={program.featured ? "hero" : "default"} className="group">
                          Enroll Now
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>

                    {/* Right - Features */}
                    <div className="bg-muted/30 p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-border/50">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-6">
                        What You'll Learn
                      </h3>
                      <ul className="space-y-4">
                        {program.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-24 bg-gradient-to-br from-emerald via-emerald to-emerald-dark text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-arabic text-2xl text-gold mb-4">
                فَاقْرَءُوا مَا تَيَسَّرَ مِنَ الْقُرْآنِ
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Not Sure Which Program to Choose?
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                Contact our advisors for personalized guidance based on your goals and current level.
              </p>
              <Link to="/contact">
                <Button variant="gold" size="lg" className="group">
                  Get Guidance
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Programs;
