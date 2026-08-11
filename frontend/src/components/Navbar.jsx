export default function Navbar({ setSidebarOpen }) {
  return (
    <header className="bg-brand-navy px-6 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Mobile Hamburger */}

        <button
          onClick={() => setSidebarOpen(true)}
          className="
          text-2xl
          text-white
          md:hidden
          "
        >
          ☰
        </button>

        {/* Logo */}

        <span
          className="
          text-lg
          font-bold
          tracking-wide
          text-white
          "
        >
          DRRCS
        </span>

        {/* Desktop Navigation */}

        <nav
          className="
          hidden
          items-center
          gap-6
          text-sm
          text-white/90
          md:flex
          "
        >
          <span className="cursor-pointer hover:text-white">Home</span>

          <span className="cursor-pointer hover:text-white">My Missions</span>

          <span className="cursor-pointer hover:text-white">Profile</span>

          {/* Avatar */}

          <span
            className="
            h-7
            w-7
            rounded-full
            bg-white/80
            "
          />
        </nav>

        {/* Mobile Avatar */}

        <span
          className="
          h-7
          w-7
          rounded-full
          bg-white/80
          md:hidden
          "
        />
      </div>
    </header>
  );
}
