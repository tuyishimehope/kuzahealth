// src/components/layout/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { ModernDropdownSelector } from "./useLanguageSelector";

interface NavLink {
  name: string;
  path: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  // Language change handler
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  // Define navigation links
  const navLinks: NavLink[] = [
    // { name: "Home", path: "/" },
    // { name: "About", path: "/about" },
    // { name: "Services", path: "/services" },
    // { name: "Contact", path: "/contact" },
  ];

  // Scroll listener for navbar style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsMenuOpen(false), [location]);

  // Active link detection
  const isActiveLink = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold transition-colors duration-300"
              style={{ color: isScrolled || isMenuOpen ? "#7c3aed" : "#ffffff" }}>
          KuzaCare
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium transition-colors duration-200 ${
                isScrolled
                  ? isActiveLink(link.path)
                    ? "text-purple-600"
                    : "text-gray-700 hover:text-purple-600"
                  : isActiveLink(link.path)
                  ? "text-white font-semibold"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Button
            variant={isScrolled ? "primary" : "outline"}
            size="sm"
            className={!isScrolled ? "border-white text-white hover:bg-white/20" : ""}
            onClick={() => navigate("/auth/signin")}
          >
            {t("button.getStarted")}
          </Button>

          {/* Language Selector */}
          {/* <select
            value={lang}
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-2 py-1 rounded bg-white text-gray-800"
          >
            <option value="en">English</option>
            <option value="rw">Kinyarwanda</option>
            <option value="fr">French</option>
          </select>
          */}
        <ModernDropdownSelector lang={lang} changeLanguage={changeLanguage}/>
        </div> 

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden focus:outline-none z-10"
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-5">
            <span
              className={`absolute block h-0.5 w-6 transform transition duration-300 ease-in-out ${
                isMenuOpen ? "rotate-45 translate-y-2.5 bg-gray-800" : isScrolled ? "bg-gray-800" : "bg-white"
              }`}
            />
            <span
              className={`absolute block h-0.5 mt-2 w-6 transform transition duration-300 ease-in-out ${
                isMenuOpen ? "opacity-0" : isScrolled ? "bg-gray-800" : "bg-white"
              }`}
            />
            <span
              className={`absolute block h-0.5 mt-4 w-6 transform transition duration-300 ease-in-out ${
                isMenuOpen ? "-rotate-45 -translate-y-2.5 bg-gray-800" : isScrolled ? "bg-gray-800" : "bg-white"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "60px" }}
      >
        <div className="flex flex-col p-4 space-y-6 pt-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xl transition-colors duration-200 ${
                isActiveLink(link.path) ? "text-purple-600 font-semibold" : "text-gray-700 hover:text-purple-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate("/auth/signin")}>
            Get Started
          </Button>

          {/* Mobile Language Selector */}
          <select
            value={lang}
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-2 py-1 rounded bg-gray-200 text-gray-800 mt-4"
          >
            <option value="en">English</option>
            <option value="rw">Kinyarwanda</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
