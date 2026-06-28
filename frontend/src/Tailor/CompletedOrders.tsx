import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CompletedOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

const fetchCompletedOrders = async () => {
    const tailorId = localStorage.getItem("tailorId");
    if (!tailorId) return;

    const res = await fetch(
      `https://tailorconnect-backend.onrender.com/TailorCustomer/${tailorId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    const data = await res.json();

    const delivered = Array.isArray(data)
      ? data
          .filter((o: any) => o.status === "Delivered")
          .sort((a: any, b: any) =>
            new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime()
          )
      : [];

    setOrders(delivered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8ec] via-[#f6ecd3] to-[#ead39a] px-8 py-10">

      {/* HEADER */}
      <div className="text-center mb-12">

        <h1 className="text-6xl font-serif font-bold text-[#b8963f] tracking-wide">
          Completed Orders ✨
        </h1>
        <p className="text-[#8c7440] mt-3 text-lg">
          Delivered outfits archive 📦
        </p>

        <p className="text-[#8c7440] mt-1 text-sm">
          {orders.length} orders delivered 📦
        </p>
      </div>

      {orders.length === 0 && (
        <p className="text-center text-[#8c7440] mt-10">
          No completed orders yet ✨
        </p>
      )}



      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-[#e3c98b] hover:shadow-2xl transition-all duration-300"
          >

            {/* BADGE */}
            <div className="absolute top-3 right-3 px-3 py-1 text-[10px] bg-green-100 text-green-700 rounded-full">
              Delivered ✅
            </div>

            <h2 className="text-2xl text-[#b8963f] font-semibold mb-3">
              {order.customerName}
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p>🧵 Outfit: <span className="font-medium">{order.outfit}</span></p>
              <p>📅 Delivered on: <span className="font-medium text-[#8c7440]">{order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString()
                : "N/A"}</span></p>
            </div>

            <div className="my-4 h-[1px] bg-gradient-to-r from-transparent via-[#e3c98b] to-transparent"></div>

            <p className="text-xs text-gray-500 italic">
              ✔ Successfully completed order
            </p>

          </motion.div>
        ))}
      </div>
    </div>
  );
}