import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary via-primary to-emerald-dark relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-light/20 rounded-full blur-3xl" />
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 islamic-pattern" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-primary-foreground">
              Begin Your Journey Today
            </span>
          </div>

          {/* Arabic Quote */}
          <p className="font-arabic text-2xl md:text-3xl text-gold mb-4">
            وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
          </p>
          <p className="text-primary-foreground/80 text-sm mb-8">
            "And recite the Qur'an with measured recitation" - Al-Muzzammil 73:4
          </p>

          {/* Main Heading */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Embark on Your Qur'anic Journey?
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Join hundreds of students at KJUMJ who are transforming their lives through the light of the Qur'an.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="gold" size="xl" className="group">
                Enroll Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="glass"
                size="xl"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
