import React from "react";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { GoTasklist } from "react-icons/go";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/" },
    { name: "Contact", path: "/" },
    { name: "About", path: "/" },
  ];

  const ref = React.useRef(null);

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }
    setIsScrolled((prev) => (location.pathname !== "/" ? true : prev));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const { authUser , logout } = useAuthStore();

  return (
    <nav
      className={`fixed top-0 left-0 bg-neutral-900 w-full flex items-center justify-between px-4 md:px-16 lg:px-20 xl:px-20 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-neutral-700 shadow-md  backdrop-blur-lg py-4 md:py-4"
          : "py-4 md:py-4"
      }`}
    >
      {/* Logo */}
      <Link to={"/"} className="flex items-center gap-2">
        <p className="text-2xl">
          <GoTasklist />
        </p>
        <p className="font-serif text-2xl tracking-tight">Task Manager</p>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {/* {navLinks.map((link, i) => (
          <a key={i} href={link.path} className={`group flex flex-col gap-0.5`}>
            {link.name}
            <div
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </a>
        ))} */}
        {/* <button
          className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
            isScrolled ? "text-white" : "text-white"
          } transition-all`}
        >
          New Launch
        </button> */}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-10">
        {/* <svg
          className={`h-6 w-6 ${isScrolled ? "invert" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg> */}

        <p className="font-serif text-lg tracking-tight">
          {authUser ? `Welcome, ${authUser.username.split(" ")[0]}` : "Welcome"}
        </p>
        <button onClick={logout} className="   bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-10 rounded-full cursor-pointer">
          Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <svg
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {navLinks.map((link, i) => (
          <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </a>
        ))}

        <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
          New Launch
        </button>

        <button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
