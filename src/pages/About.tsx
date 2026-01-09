import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Users, BookOpen, Award, ArrowRight } from "lucide-react";
import alreyan from "@/assets/al-reyan.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 lg:py-10 bg-gradient-to-b from-background to-muted/30 islamic-pattern">
        {/* <img className="w-full h-96" src={
                alreyan
              } alt="" /> */}
          <div className="container mx-auto px-2">
            <div className="max-w-3xl mx-auto text-center">
              
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                About Irshad
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Nurturing Hearts Through{" "}
                <span className="text-gradient-emerald">The Brain</span> of the Jemea
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Irshad is the Quran Memorization & Islamic Education Structure at KJUMJ. Its the brain of the Jemea dedicated to preserving and spreading the knowledge of Islam.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-card rounded-2xl p-8 lg:p-10 border border-border/50 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide comprehensive Islamic education that empowers students to memorize, 
                  understand, and live by the teachings of the Holy Qur'an. We strive to create 
                  a supportive learning environment that nurtures both spiritual and academic growth.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 lg:p-10 border border-border/50 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Our Vision
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading center for Qur'anic education in Ethiopia, producing 
                  Huffaz (memorizers) and scholars who will carry the light of the Qur'an to 
                  future generations and serve as beacons of knowledge in their communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-secondary text-sm font-medium mb-4">
                Our Values
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Principles That Guide Us
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: Heart,
                  title: "Sincerity",
                  description: "Every action is dedicated to seeking Allah's pleasure and serving the Ummah.",
                  color: "emerald",
                },
                {
                  icon: BookOpen,
                  title: "Excellence",
                  description: "Striving for the highest standards in Qur'anic recitation and Islamic scholarship.",
                  color: "gold",
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "Building a supportive brotherhood and sisterhood united by the love of the Qur'an.",
                  color: "accent",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-card rounded-2xl p-8 text-center border border-border/50 hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                      value.color === "emerald"
                        ? "bg-gradient-to-br from-emerald/20 to-emerald/10"
                        : value.color === "gold"
                        ? "bg-gradient-to-br from-gold/20 to-gold/10"
                        : "bg-gradient-to-br from-accent/20 to-accent/10"
                    }`}
                  >
                    <value.icon
                      className={`w-8 h-8 ${
                        value.color === "emerald"
                          ? "text-primary"
                          : value.color === "gold"
                          ? "text-secondary"
                          : "text-accent"
                      }`}
                    />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 lg:py-24 bg-sidebar text-sidebar-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "150+", label: "Active Students" },
                { number: "50+", label: "Qualified Teachers" },
                { number: "10+", label: "Years of Excellence" },
                { number: "50+", label: "Huffaz Graduates" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <h3 className="font-display text-4xl lg:text-5xl font-bold text-sidebar-primary mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-sidebar-foreground/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Join Our Community?
              </h2>
              <p className="text-muted-foreground mb-8">
                Begin your journey of Qur'anic learning today and become part of the Irshad family.
              </p>
              <Link to="/register">
                <Button variant="hero" size="lg" className="group">
                  Get Started
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

export default About;
