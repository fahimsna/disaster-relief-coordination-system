// Static top nav bar, just for visual context.
// Not wired to real routes/auth yet -- that's out of scope for this feature.
export default function Navbar() {
  return (
    <header className="bg-brand-navy px-6 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="text-lg font-bold text-white tracking-wide">
          DRRCS
        </span>
        <nav className="flex items-center gap-6 text-sm text-white/90">
          <span className="cursor-pointer hover:text-white">Home</span>
          <span className="cursor-pointer hover:text-white">My Missions</span>
          <span className="cursor-pointer hover:text-white">Profile</span>
          <span className="h-7 w-7 rounded-full bg-white/80" />{" "}
          {/* avatar placeholder */}
        </nav>
      </div>
    </header>
  );
}
