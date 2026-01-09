import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Youtube} from "lucide-react";
import irshadLogo from "@/assets/irshad-logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      {/* Decorative Border */}
      <div className="h-1 geometric-border" />
      
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center">
               <img
              src={irshadLogo}
              alt="Irshad Logo"
              className="w-12 h-12 lg:w-14 lg:h-14 object-contain"
            />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center">
                  <img src="./assets/irshad-logo.jpg" alt="" />
                </div>
              </div>
              <div className="flex flex-col">

                <span className="font-display text-2xl font-bold text-sidebar-foreground">
                  Irshad
                </span>
                <span className="text-xs text-sidebar-foreground/60">
                  KJUMJ
                </span>
              </div>
            </Link>
            <p className="text-sm text-sidebar-foreground/70 leading-relaxed mb-6">
              Nurturing hearts and minds through Qur'anic education and Islamic values at KJUMJ, Jimma University.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
             
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-sidebar-primary">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Programs", path: "/programs" },
                { name: "Library", path: "/library" },
                { name: "Tajwid", path: "/tajwid" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-sidebar-primary">
              Programs
            </h4>
            <ul className="space-y-3">
              {[
                "Hifz Program",
                "Tajwid Course",
                "Kitab Studies",
                "Arabic Language",
                "Weekly Circles",
              ].map((program) => (
                <li key={program}>
                  <span className="text-sm text-sidebar-foreground/70">
                    {program}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-sidebar-primary">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sidebar-primary mt-0.5" />
                <span className="text-sm text-sidebar-foreground/70">
                  KJUMJ, Al-Reyan <br />Jimma, Ethiopia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sidebar-primary" />
                <span className="text-sm text-sidebar-foreground/70">
                  +251 47 111 1111
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sidebar-primary" />
                <span className="text-sm text-sidebar-foreground/70">
                  irshad@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sidebar-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-sidebar-foreground/60">
              © 2024 Irshad - KJUMJ,Jimma University. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
