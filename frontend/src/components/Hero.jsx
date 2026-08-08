import { Search, ShieldCheck } from "lucide-react";

const disasterTypes = ["All", "Flood", "Cyclone", "Earthquake", "Fire"];

const Hero = ({ searchTerm, setSearchTerm, selectedType, setSelectedType }) => {
  return (
    <section className="border-b border-slate-200 bg-linear-to-r from-blue-100 via-sky-50 to-cyan-100">
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm backdrop-blur">
          <ShieldCheck size={16} />
          Verified Disaster Relief Platform
        </div>

        {/* Heading */}
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Disaster Relief Campaigns
        </h1>

        {/* Description */}
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Support trusted relief campaigns and help communities recover after
          floods, cyclones, earthquakes, fires, and other emergencies.
        </p>

        {/* Search */}
        <div className="relative mt-8 max-w-xl">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-5 pl-12 text-slate-700 shadow-md outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-3">
          {disasterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                selectedType === type
                  ? "bg-blue-600 text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
