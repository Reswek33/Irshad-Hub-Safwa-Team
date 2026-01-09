import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Firdos Bedru",
    role: "Hifz Student",
    content: "Alhamdulillah, After despair overtook me ( because of مراجعة), you brought my hope back , and words fail me in expressing my thankks جزاكم الله خيرا.",
    avatar: "FB",
  },
  {
    name: "Fatima Abdi",
    role: "Tajwid Graduate",
    content: "The Tajwid course transformed my recitation. The interactive lessons and audio examples helped me understand the rules deeply.",
    avatar: "FA",
  },
  {
    name: "Nusra Sherefa",
    role: "Islamic Studies",
    content: "In my Irshad courses, I really benefited from learning Khet and Ṣarf. Khet gave me the basics of writing Arabic, which was a good starting point for improving my skills. Ṣarf helped me understand how words change and are formed, which made me more aware of the language. Overall, these courses made me feel closer to Arabic and more confident in continuing my studies.",
    avatar: "NS",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-sidebar text-sidebar-foreground relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 border border-sidebar-foreground rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-sidebar-foreground rotate-45" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-sidebar-primary/20 text-sidebar-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-sidebar-foreground mb-4">
            Voices of Our <span className="text-sidebar-primary">Community</span>
          </h2>
          <p className="text-sidebar-foreground/70 text-lg">
            Hear from students whose lives have been transformed through Qur'anic education.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-sidebar-accent rounded-2xl p-8 relative group hover:bg-sidebar-accent/80 transition-colors duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center">
                <Quote className="w-5 h-5 text-sidebar-primary" />
              </div>

              {/* Content */}
              <p className="text-sidebar-foreground/80 leading-relaxed mb-8 text-lg">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-sidebar-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-sidebar-foreground/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
