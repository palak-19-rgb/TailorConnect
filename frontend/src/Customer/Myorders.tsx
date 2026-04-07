import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
   const email = localStorage.getItem("email");

if (!email) return;

const res = await fetch(
  `http://localhost:2007/TailorCustomer/customer/${email}`
);
    const data = await res.json();

    setOrders(data || []);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cutting":
        return "bg-blue-100 text-blue-700";
      case "Stitching":
        return "bg-purple-100 text-purple-700";
      case "Ready":
        return "bg-green-100 text-green-700";
      case "Delivered":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8ec] via-[#f6ecd3] to-[#ead39a] px-8 py-10">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-[#b8963f] tracking-wide drop-shadow-md">
          My Orders
        </h1>
        <p className="text-[#8c7440] mt-3 text-lg">
          Track your outfits beautifully ✨
        </p>
      </div>


      {orders.length === 0 && (
        <p className="text-center text-[#8c7440] mt-10">
          No orders yet ✨
        </p>
      )}



      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((o) => (
          <motion.div
            key={o._id}
            whileHover={{ scale: 1.05, rotateX: 4, rotateY: -4 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-[#e3c98b]
          hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300"
          >

            {/* GLOW EFFECT */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#d4b25f]/20 to-transparent opacity-0 hover:opacity-100 transition"></div>

            {/* OUTFIT */}
            <h2 className="text-xl text-[#b8963f] font-semibold mb-2 z-10 relative">
              🧵 {o.outfit}
            </h2>

            {/* DETAILS */}
            <div className="space-y-2 text-sm text-gray-700 z-10 relative">
              <p>📅 Delivery: {o.deliveryDate
                ? new Date(o.deliveryDate).toLocaleDateString()
                : "N/A"} ✅</p>
              <p>📍 Tailor Assigned</p>
            </div>

            {/* STATUS */}
            <div
              className={`mt-4 inline-block px-4 py-1 rounded-full text-xs font-semibold shadow-md ${getStatusColor(
                o.status
              )}`}
            >
              {o.status}
            </div>

            {/* PROGRESS BAR */}
            <div className="flex items-center justify-between mt-6">
              {["Pending", "Cutting", "Stitching", "Ready", "Delivered"].map(
                (step, index) => {
                  const currentIndex = ["Pending", "Cutting", "Stitching", "Ready", "Delivered"].indexOf(o.status);

                  return (
                    <div key={step} className="flex-1 flex items-center">

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow
                      ${currentIndex >= index
                            ? "bg-gradient-to-br from-[#d4b25f] to-[#b8963f] text-white scale-110"
                            : "bg-[#f3ead1] text-[#8c7440]"
                          }`}
                      >
                        {index + 1}
                      </div>

                      {index < 4 && (
                        <div
                          className={`flex-1 h-1 rounded-full ${currentIndex > index
                              ? "bg-gradient-to-r from-[#d4b25f] to-[#b8963f]"
                              : "bg-[#eee]"
                            }`}
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>

            <p className="mt-3 text-black text-sm">
              📅 Delivery: {new Date(o.deliveryDate).toLocaleDateString()}
            </p>
            {/* STATUS TEXT */}
            {o.status !== "Delivered" && (
              <p className="text-red-500 text-xs mt-4 animate-pulse">
                ⏳ In progress...
              </p>
            )}

            {o.status === "Delivered" && (
              <p className="text-green-600 text-xs mt-4 font-semibold">
                ✅ Completed
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}