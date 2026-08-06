import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 flex items-center justify-center p-6">
          <div
            className="
            max-w-md
            rounded-3xl
            bg-white
            p-8
            text-center
            shadow-sm
          "
          >
            <div
              className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-red-100
              text-3xl
            "
            >
              !
            </div>

            <h1
              className="
              mt-5
              text-3xl
              font-bold
              text-[#222831]
            "
            >
              Payment Cancelled
            </h1>

            <p
              className="
              mt-3
              text-gray-500
            "
            >
              Your donation was not completed. You can try again anytime.
            </p>

            <Link
              to="/campaigns"
              className="
                mt-6
                block
                rounded-xl
                bg-[#00ADB5]
                py-3
                font-semibold
                text-white
                hover:bg-[#0097A0]
              "
            >
              Browse Campaigns
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
