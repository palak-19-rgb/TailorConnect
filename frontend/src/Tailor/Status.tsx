
import { useState , useEffect } from "react";
import { motion } from "framer-motion";

type Order = {
  _id: string;
  name: string;
  outfit: string;
  deliveryDate: string;
  status: string;
};

export default function OrderStatus() {


  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const statuses = ["Pending", "Cutting", "Stitching", "Ready", "Delivered"];
   const isOverdue = (date: string) => {
  const today = new Date();
  const d = new Date(date);
  return d.setHours(0,0,0,0) < today.setHours(0,0,0,0);
};

const filteredOrders = orders.filter(
  (order) =>
   order?.name?.toLowerCase().includes(search.toLowerCase()) &&
    order.status !== "Delivered"
);


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



  useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
const tailorId = localStorage.getItem("tailorId");
  const res = await fetch(
    `https://tailorconnect-backend.onrender.com/TailorCustomer/${tailorId}`,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );

  const data = await res.json();
  console.log("ORDERS:", data);
setOrders(Array.isArray(data) ? data : []);


};



const updateStatus = async (id: string, newStatus: string) => {
  await fetch("https://tailorconnect-backend.onrender.com/TailorCustomer/update-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ id, status: newStatus })
  });

  fetchOrders();
};


const deleteOrder = async (id: string) => {
  const confirmDelete = window.confirm("Delete this order?");
  if (!confirmDelete) return;

  await fetch("https://tailorconnect-backend.onrender.com/TailorCustomer/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ id })
  });

  fetchOrders();
};


  return (
   <div className="min-h-screen bg-gradient-to-br from-[#fdf8ec] via-[#f6ecd3] to-[#ead39a] px-8 py-10">
      {/* HEADER */}
     <div className="text-center mb-10">
  <h1 className="text-6xl font-serif font-bold text-[#b8963f] tracking-wider">
    Stitching Status
  </h1>
  <p className="text-[#8c7440] mt-2 text-lg">
    Track every order beautifully ✨
  </p>
</div>


<div className="flex justify-center mb-8">
  <input
    placeholder="Search customer..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-[300px] px-4 py-2 rounded-full bg-white border border-[#e6d3a3] text-black focus:outline-none focus:ring-2 focus:ring-[#c6a75a]"
  />
</div>




<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
  <div className="relative bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-[#e3c98b]">
    <p className="text-sm text-[#8c7440]">Total Orders</p>
    <h2 className="text-3xl font-bold text-[#b8963f] mt-2">
      {orders.length}
    </h2>
  </div>

  <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-[#e3c98b]">
    <p className="text-sm text-[#8c7440]">Ready Orders</p>
    <h2 className="text-3xl font-bold text-green-600 mt-2">
      {orders.filter(o => o.status === "Ready").length}
    </h2>
  </div>

  <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-[#e3c98b]">
    <p className="text-sm text-[#8c7440]">Delivered</p>
    <h2 className="text-3xl font-bold text-blue-600 mt-2">
      {orders.filter(o => o.status === "Delivered").length}
    </h2>
  </div>
</div>


        {filteredOrders.length === 0 && (
  <p className="text-center text-[#8c7440] mt-10">
    No orders found ✨
  </p>
)}


      {/* ORDER GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <motion.div
            key={order._id}
            whileHover={{ scale: 1.02 }}
                    className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-[#e3c98b] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-xl text-[#b8963f] font-semibold mb-2">
             {order.name}
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <p>🧵 Outfit: {order.outfit}</p>

              <p>📅 Delivery: {order.deliveryDate}</p>
            </div>

            {/* STATUS BADGE */}
            <div
              className={`mt-4 inline-block px-4 py-1 rounded-full text-xs font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </div>


    

<div className="flex items-center justify-between mt-5 mb-4">
  {statuses.map((step, index) => (
    <div key={step} className="flex-1 flex items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
        ${
          statuses.indexOf(order.status) >= index
            ? "bg-[#b8963f] text-white"
            : "bg-[#f3ead1] text-[#8c7440]"
        }`}
      >
        {index + 1}
      </div>

      {index < statuses.length - 1 && (
        <div
          className={`flex-1 h-1
          ${
            statuses.indexOf(order.status) > index
              ? "bg-[#b8963f]"
              : "bg-[#eee]"
          }`}
        />
      )}
    </div>
  ))}
</div>
{!["Ready", "Delivered"].includes(order.status) && (
  <p className="text-red-500 text-xs mt-2">
    ⏰ Delivery soon
  </p>
)}


<p
  className={`text-sm ${
    isOverdue(order.deliveryDate) ? "text-red-500 font-semibold" : ""
  }`}
>
 
</p>

<button
  onClick={() => deleteOrder(order._id)}
  className="absolute top-3 right-3 w-8 h-8 rounded-full
  bg-white/40 backdrop-blur-sm text-[#b8963f]
  hover:bg-red-50 hover:text-red-500
  flex items-center justify-center transition"
>
  ✕
</button>


            {/* STATUS BUTTONS */}
            <div className="grid grid-cols-2 gap-2 mt-5">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(order._id, status)}
                  className="py-2 text-xs rounded-lg bg-[#fff8e6] border border-[#e6d3a3]
                  hover:bg-[#f3e2b4] transition text-[#8c7440]"
                >
                  {status}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}