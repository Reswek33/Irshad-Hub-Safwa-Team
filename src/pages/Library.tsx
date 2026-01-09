import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Clock, User, Filter } from "lucide-react";

const books = [
  {
    id: 1,
    title: "Tafsir Ibn Kathir",
    author: "Ismail Ibn Kathir",
    category: "Tafsir",
    available: true,
    copies: 5,
    image: "📚",
  },
  {
    id: 2,
    title: "Sahih Al-Bukhari",
    author: "Imam Bukhari",
    category: "Hadith",
    available: true,
    copies: 8,
    image: "📖",
  },
  {
    id: 3,
    title: "Al-Jazariyyah",
    author: "Ibn Al-Jazari",
    category: "Tajwid",
    available: true,
    copies: 12,
    image: "📕",
  },
  {
    id: 4,
    title: "Riyadh As-Saliheen",
    author: "Imam An-Nawawi",
    category: "Hadith",
    available: false,
    copies: 0,
    image: "📗",
  },
  {
    id: 5,
    title: "Al-Aqeedah Al-Wasitiyyah",
    author: "Ibn Taymiyyah",
    category: "Aqeedah",
    available: true,
    copies: 3,
    image: "📘",
  },
  {
    id: 6,
    title: "Ar-Raheeq Al-Makhtum",
    author: "Safi-ur-Rahman Mubarakpuri",
    category: "Seerah",
    available: true,
    copies: 6,
    image: "📙",
  },
];

const categories = ["All", "Tafsir", "Hadith", "Tajwid", "Aqeedah", "Seerah", "Fiqh"];

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-10 lg:py-10 bg-gradient-to-b from-background to-muted/30 islamic-pattern">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Irshad Library
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Explore Our Islamic{" "}
                <span className="text-gradient-emerald">Library</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Access a rich collection of Islamic books, Tafsir, Hadith collections, and educational resources.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search books by title or author..."
                  className="pl-12 h-14 text-lg rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories & Books */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            {/* Categories */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{book.image}</div>
                    <div className="flex-1">
                      <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                        {book.category}
                      </span>
                      <h3 className="font-display text-lg font-semibold text-foreground mt-2">
                        {book.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <User className="w-4 h-4" />
                    {book.author}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          book.available ? "bg-primary" : "bg-destructive"
                        }`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {book.available ? `${book.copies} copies available` : "Not available"}
                      </span>
                    </div>
                    <Button
                      variant={book.available ? "default" : "outline"}
                      size="sm"
                      disabled={!book.available}
                    >
                      {book.available ? "Borrow" : "Reserved"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No books found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Library Info */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl p-6 text-center border border-border/50">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Opening Hours
                </h3>
                <p className="text-muted-foreground text-sm">
                  Saturday - Thursday<br />
                  8:00 AM - 10:00 PM
                </p>
              </div>
              <div className="bg-card rounded-2xl p-6 text-center border border-border/50">
                <BookOpen className="w-10 h-10 text-secondary mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Borrowing Period
                </h3>
                <p className="text-muted-foreground text-sm">
                  2 weeks per book<br />
                  Maximum 3 books
                </p>
              </div>
              <div className="bg-card rounded-2xl p-6 text-center border border-border/50">
                <User className="w-10 h-10 text-accent mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Membership
                </h3>
                <p className="text-muted-foreground text-sm">
                  Free for all<br />
                  Irshad students
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
