import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";

const CertificatePreview = () => {
  const { token, user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [volunteerId, setVolunteerId] = useState("");
  const [missionId, setMissionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://disaster-relief-coordination-system-kmf2.onrender.com/api";

  // =========================================================
  // FETCH CERTIFICATES
  // =========================================================

  useEffect(() => {
    if (token && (user?.role === "volunteer" || user?.role === "admin")) {
      fetchCertificates();
    }
  }, [token, user]);

  const fetchCertificates = async () => {
    try {
      const id = volunteerId || user?.id;

      if (!id || !token) {
        return;
      }

      const response = await axios.get(
        `${API_URL}/notifications/certificate/volunteer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCertificates(response.data.data || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  // =========================================================
  // DOWNLOAD CERTIFICATE
  // =========================================================

  const downloadCertificate = async (volId, missId) => {
    try {
      if (!volId || !missId) {
        toast.error("Volunteer ID and Mission ID are required");
        return;
      }

      setLoading(true);

      const response = await axios.get(
        `${API_URL}/notifications/certificate/${volId}/${missId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `certificate-${volId}-${Date.now()}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);

      toast.error(
        error.response?.data?.message || "Failed to download certificate",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GENERATE CERTIFICATE
  // =========================================================

  const handleGenerate = () => {
    if (!volunteerId.trim() || !missionId.trim()) {
      toast.error("Please enter both Volunteer ID and Mission ID");
      return;
    }

    downloadCertificate(volunteerId.trim(), missionId.trim());
  };

  // =========================================================
  // CLOSE SIDEBAR WHEN CLICKING OVERLAY
  // =========================================================

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F7FA]">
      {/* =====================================================
          NAVBAR
          DO NOT MODIFY NAVBAR
      ===================================================== */}

      <div className="fixed inset-x-0 top-0 z-[100]">
        <Navbar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobileSidebar}
          className="
            fixed
            inset-0
            z-[110]
            bg-black/40
            md:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR

          Desktop:
          - Always visible
          - 256px wide

          Mobile:
          - Hidden by default
          - Slides in when Navbar opens it
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          bottom-0
          top-0
          z-[120]
          w-[256px]
          bg-white
          border-r
          border-gray-200
          transition-transform
          duration-300
          ease-in-out
          md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full overflow-y-auto pt-16">
          <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        className="
          min-h-screen
          w-full
          pt-16
          md:ml-[256px]
          md:w-[calc(100%-256px)]
        "
      >
        <div
          className="
            w-full
            px-4
            py-5
            sm:px-6
            sm:py-6
            lg:px-8
            lg:py-8
          "
        >
          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <header className="mb-6 sm:mb-8">
            <h1
              className="
                text-2xl
                font-bold
                leading-tight
                text-gray-800
                sm:text-3xl
                lg:text-4xl
              "
            >
              🏅 Volunteer Completion Certificates
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-gray-500
                sm:text-base
              "
            >
              Download certificates for completed missions.
            </p>
          </header>

          {/* =================================================
              ADMIN GENERATE
          ================================================= */}

          {user?.role === "admin" && (
            <section
              className="
                mb-6
                w-full
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-4
                shadow-sm
                sm:p-6
              "
            >
              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-800
                  sm:text-xl
                "
              >
                Admin: Generate Certificate
              </h2>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-4
                  lg:grid-cols-2
                "
              >
                {/* Volunteer ID */}

                <div className="min-w-0">
                  <label
                    htmlFor="volunteerId"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    Volunteer ID
                  </label>

                  <input
                    id="volunteerId"
                    type="text"
                    value={volunteerId}
                    onChange={(e) => setVolunteerId(e.target.value)}
                    className="
                      block
                      w-full
                      min-w-0
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-800
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/20
                    "
                    placeholder="Enter volunteer ID"
                  />
                </div>

                {/* Mission ID */}

                <div className="min-w-0">
                  <label
                    htmlFor="missionId"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    Mission ID
                  </label>

                  <input
                    id="missionId"
                    type="text"
                    value={missionId}
                    onChange={(e) => setMissionId(e.target.value)}
                    className="
                      block
                      w-full
                      min-w-0
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-800
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/20
                    "
                    placeholder="Enter mission ID"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!volunteerId.trim() || !missionId.trim() || loading}
                className="
                  mt-5
                  w-full
                  rounded-lg
                  bg-blue-600
                  px-6
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:w-auto
                "
              >
                {loading ? "Generating..." : "Generate Certificate"}
              </button>
            </section>
          )}

          {/* =================================================
              CERTIFICATES
          ================================================= */}

          <section
            className="
              w-full
              overflow-hidden
              rounded-2xl
              border
              border-gray-100
              bg-white
              shadow-sm
            "
          >
            {/* Header */}

            <div
              className="
                border-b
                border-gray-200
                px-4
                py-4
                sm:px-6
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <h2
                  className="
                    text-lg
                    font-semibold
                    text-gray-800
                    sm:text-xl
                  "
                >
                  Available Certificates
                </h2>

                <span
                  className="
                    w-fit
                    rounded-full
                    bg-gray-100
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-gray-600
                  "
                >
                  {certificates.length} certificate
                  {certificates.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {/* =================================================
                EMPTY
            ================================================= */}

            {certificates.length === 0 ? (
              <div
                className="
                  px-5
                  py-12
                  text-center
                  text-gray-500
                  sm:px-8
                "
              >
                <p className="mb-3 text-4xl">📄</p>

                <p className="font-medium">No certificates available.</p>

                <p className="mt-1 text-sm">
                  Complete a mission to earn a certificate.
                </p>
              </div>
            ) : (
              <>
                {/* =================================================
                    DESKTOP / TABLET
                ================================================= */}

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[700px] divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="
                            whitespace-nowrap
                            px-5
                            py-3
                            text-left
                            text-xs
                            font-medium
                            uppercase
                            tracking-wider
                            text-gray-500
                            lg:px-6
                          "
                        >
                          Mission
                        </th>

                        <th
                          className="
                            whitespace-nowrap
                            px-5
                            py-3
                            text-left
                            text-xs
                            font-medium
                            uppercase
                            tracking-wider
                            text-gray-500
                            lg:px-6
                          "
                        >
                          Serial Number
                        </th>

                        <th
                          className="
                            whitespace-nowrap
                            px-5
                            py-3
                            text-left
                            text-xs
                            font-medium
                            uppercase
                            tracking-wider
                            text-gray-500
                            lg:px-6
                          "
                        >
                          Date
                        </th>

                        <th
                          className="
                            whitespace-nowrap
                            px-5
                            py-3
                            text-right
                            text-xs
                            font-medium
                            uppercase
                            tracking-wider
                            text-gray-500
                            lg:px-6
                          "
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                      {certificates.map((cert) => (
                        <tr
                          key={cert.id}
                          className="transition hover:bg-gray-50"
                        >
                          <td
                            className="
                              max-w-[300px]
                              break-words
                              px-5
                              py-4
                              text-sm
                              text-gray-900
                              lg:px-6
                            "
                          >
                            {cert.missionName || "Mission unavailable"}
                          </td>

                          <td
                            className="
                              max-w-[220px]
                              break-all
                              px-5
                              py-4
                              text-sm
                              text-gray-500
                              lg:px-6
                            "
                          >
                            {cert.serialNumber || "N/A"}
                          </td>

                          <td
                            className="
                              whitespace-nowrap
                              px-5
                              py-4
                              text-sm
                              text-gray-500
                              lg:px-6
                            "
                          >
                            {cert.date || "N/A"}
                          </td>

                          <td
                            className="
                              whitespace-nowrap
                              px-5
                              py-4
                              text-right
                              lg:px-6
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                downloadCertificate(cert.volunteerId, cert.id)
                              }
                              disabled={loading}
                              className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#00ADB5]
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#0097A0]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >
                              {loading ? "..." : "⬇ Download"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* =================================================
                    MOBILE
                ================================================= */}

                <div className="block space-y-4 p-4 md:hidden">
                  {certificates.map((cert) => (
                    <article
                      key={cert.id}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-4
                      "
                    >
                      {/* Top */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              text-[11px]
                              font-semibold
                              uppercase
                              tracking-wider
                              text-gray-400
                            "
                          >
                            Mission
                          </p>

                          <h3
                            className="
                              mt-1
                              break-words
                              text-base
                              font-semibold
                              text-gray-800
                            "
                          >
                            {cert.missionName || "Mission unavailable"}
                          </h3>
                        </div>

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#00ADB5]/10
                            text-lg
                          "
                        >
                          🏅
                        </div>
                      </div>

                      {/* Details */}

                      <div
                        className="
                          mt-5
                          grid
                          grid-cols-1
                          gap-4
                          border-t
                          border-gray-100
                          pt-4
                        "
                      >
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400">Serial Number</p>

                          <p
                            className="
                              mt-1
                              break-all
                              text-sm
                              font-medium
                              text-gray-700
                            "
                          >
                            {cert.serialNumber || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Date</p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {cert.date || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Download */}

                      <button
                        type="button"
                        onClick={() =>
                          downloadCertificate(cert.volunteerId, cert.id)
                        }
                        disabled={loading}
                        className="
                          mt-5
                          flex
                          w-full
                          items-center
                          justify-center
                          rounded-lg
                          bg-[#00ADB5]
                          px-4
                          py-2.5
                          text-sm
                          font-semibold
                          text-white
                          transition
                          hover:bg-[#0097A0]
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {loading ? "Downloading..." : "⬇ Download Certificate"}
                      </button>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default CertificatePreview;
