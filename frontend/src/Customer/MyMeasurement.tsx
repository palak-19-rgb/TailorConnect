import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Measurement = {
  chest?: number;
  waist?: number;
  length?: number;
};

type Order = {
  _id: string;
  outfit?: string;
  measurements?: Measurement;
  status?: string;
  deliveryDate?: string;
  tailorName?: string;
};

export default function MyMeasurements() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
    const email = localStorage.getItem("email");

const res = await fetch(
  `http://localhost:2007/TailorCustomer/customer/${email}`
);
      if (!res.ok) {
        console.log("API error");
        return;
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8ec] via-[#f6ecd3] to-[#ead39a] px-8 py-10">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-[#b8963f] tracking-wide">
          My Measurements
        </h1>
        <p className="text-[#8c7440] mt-3 text-lg">
          Saved by your tailor 📏
        </p>
      </div>

      {/* NO DATA */}
      {orders.length === 0 && (
        <p className="text-center text-gray-600">
          No measurements found 😔
        </p>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {orders.map((o) => (
          <motion.div
            key={o._id}
            whileHover={{
              scale: 1.05,
              rotateX: 5,
              rotateY: -5,
            }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-[#e3c98b]
            hover:shadow-2xl transition-all duration-300"
          >

            {/* OUTFIT */}
            <h2 className="text-xl font-semibold text-[#b8963f] relative z-10">
              🧵 {o.outfit || "Outfit"}
            </h2>

            <p className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-[#fff3cd] text-[#8c7440] relative z-10">
              👤 {o.tailorName || "Tailor Assigned"}
            </p>
            {/* DELIVERY (formatted + clean) */}
            <p className="text-sm text-black mt-3">
              📅 Delivery:{" "}
              {o.deliveryDate
                ? new Date(o.deliveryDate).toLocaleDateString()
                : "N/A"}
            </p>

            {/* STATUS */}
            <p className="text-sm text-gray-600 mt-1">
              Status: {o.status || "Pending"}
            </p>

            {/* DIVIDER */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#e3c98b] to-transparent my-4"></div>
{/* MEASUREMENTS */}
{o.measurements ? (
  <div className="space-y-2 text-sm text-[#5c4b2c]">
    {Object.entries(o.measurements).map(([key, value]) => (
      <p key={key} className="flex justify-between">
        <span className="capitalize">{key}</span>
        <span>{value || "-"}</span>
      </p>
    ))}
  </div>
) : (
  <p className="text-gray-500 text-sm">
    No measurements added
  </p>
)}
          </motion.div>
        ))}

      </div>
    </div>
  );
}