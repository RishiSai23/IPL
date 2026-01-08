const Header = () => {
    const scrollToSection = (id: string) => {
      const section = document.getElementById(id);
      section?.scrollIntoView({ behavior: "smooth" });
    };
  
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-20 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollToSection("home")}
            className="text-xl font-semibold text-teal-400"
          >
            PULSE
          </button>
  
          <nav className="hidden md:flex gap-8 text-sm text-gray-300">
            <button onClick={() => scrollToSection("intelligence")}>Intelligence</button>
            <button onClick={() => scrollToSection("stats")}>Metrics</button>
            <button onClick={() => scrollToSection("players")}>Players</button>
            <button onClick={() => scrollToSection("methodology")}>Methodology</button>
          </nav>
  
          <button
            onClick={() => scrollToSection("players")}
            className="px-4 py-2 rounded-md bg-teal-500 text-black text-sm font-medium"
          >
            Explore
          </button>
        </div>
      </header>
    );
  };
  
  export default Header;
  