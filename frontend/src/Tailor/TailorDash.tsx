import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

import CompleteOrders from "./CompletedOrders";
import CustomerList from "./Listofcust";
import Portfolio from "./Portfolio";
import OrderStatus from "./Status";
import TailorProfile from "./TailorProfile";
import API from "../api/api";

/* ================= HERO ================= */
function TailorHero() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);



    useEffect(() => {
  const email = localStorage.getItem("email");

API.get(`/Tailor/getByEmail/${email}`)
    .then((res: { data: any }) => {
  console.log(res.data);
});
}, []);

    const bgX = useTransform(mouseX, [0, window.innerWidth], [-15, 15]);
    const bgY = useTransform(mouseY, [0, window.innerHeight], [-15, 15]);

    const lightX = useTransform(mouseX, [0, window.innerWidth], [-150, 150]);
    const lightY = useTransform(mouseY, [0, window.innerHeight], [-150, 150]);


    const navigate = useNavigate();

const handleLogout = () => {
  localStorage.clear();
  navigate("/");
};
    return (
        <div className="relative h-[60vh] w-full overflow-hidden rounded-b-[50px]">
  {/* 🔴 LOGOUT BUTTON */}
  <button
    onClick={handleLogout}
    className="
  absolute top-5 right-5
  px-5 py-2 rounded-full
  text-xs tracking-wide
  font-semibold

  bg-white/20 backdrop-blur-md
  border border-[#d4b25f]

  text-[#f5e6b3]

  shadow-[0_5px_20px_rgba(0,0,0,0.3)]

  hover:bg-[#d4b25f]
  hover:text-[#3b2f1c]
  hover:scale-105

  transition-all duration-300
  z-20
  "
  >
    Logout ✨
  </button>
            {/* DARK FABRIC BG */}
            <motion.div
                style={{ x: bgX, y: bgY }}
                className="absolute inset-0 bg-[url('/fabric.jpg')] bg-cover bg-center scale-110 brightness-[0.4]"
            />

            {/* DARK GOLD OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a140a]/80 via-[#3b2f1c]/70 to-[#b8963f]/40" />

            {/* GRAIN */}
            <motion.div
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ repeat: Infinity, duration: 6 }}
                className="absolute inset-0 bg-[url('/grain.png')] mix-blend-overlay"
            />

            {/* LIGHT */}
            <motion.div
                style={{ x: lightX, y: lightY }}
                className="absolute w-[300px] h-[300px] rounded-full bg-[#d4b25f]/20 blur-3xl"
            />

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs tracking-[5px] text-[#d4b25f]/70 uppercase"
                >
                    Tailor Dashboard
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="
            mt-3
            text-4xl md:text-5xl font-serif font-semibold
            bg-gradient-to-r from-[#f5e6b3] via-[#d4b25f] to-[#8c7440]
            bg-clip-text text-transparent
          "
                >
                    Manage Your Craft
                </motion.h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80px" }}
                    transition={{ delay: 0.5 }}
                    className="h-[1px] bg-[#d4b25f] mt-5"
                />

            </div>
        </div>
    );
}

/* ================= DASHBOARD ================= */
function TailorHome() {
    const nav = useNavigate();
const [profileComplete, setProfileComplete] = useState(false);
    const cards = [
        { title: "👤 Profile", path: "profile" },
        { title: "🧵 My Portfolio", path: "portfolio" },
        { title: "👥 Customer List", path: "customers" },
        { title: "📊 Order Status", path: "status" },
        { title: "📦 Complete Orders", path: "complete-orders" },
    ];

useEffect(() => {
  const handleBack = (e: PopStateEvent) => {
    const confirmLogout = window.confirm("Do you want to logout?");

    if (confirmLogout) {
      localStorage.clear();
     nav("/");
    } else {
      // stay on same page
      window.history.pushState(null, "", window.location.pathname);
    }
  };

  // push state once so back button trigger ho
  window.history.pushState(null, "", window.location.pathname);
  
  window.addEventListener("popstate", handleBack);

  return () => {
    window.removeEventListener("popstate", handleBack);
  };
}, []);



useEffect(() => {
  const email = localStorage.getItem("email");
  if (!email) return;

  API.get(`/Tailor/getByEmail/${email}`)
    .then((res: any) => {
      const data = res.data;

      if (data?.shopName && data?.phone) {
        setProfileComplete(true);
      } else {
        setProfileComplete(false);
      }
    })
    .catch(() => setProfileComplete(false));
}, []);


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-[#fdf8ec] via-[#f6ecd3] to-[#ead39a] min-h-screen"
        >

            <TailorHero />

            

            {/* CARDS */}
            <div className="px-10 py-16">

                <h2 className="text-3xl font-serif text-[#8c7440] mb-10 text-center">
                    Workspace
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

                    {cards.map((c, i) => (
                        <motion.div
                            key={i}
                          onClick={() => {
  if (!profileComplete && c.path !== "profile") {
    alert("⚠️ PLEASE COMPLETE YOUR PROFILE TO ACCESS OTHER OPTIONS");
    nav("profile");
    return;
  }
  nav(c.path);
}}
                            whileHover={{ scale: 1.06 }}
                            className="
                relative group cursor-pointer
                bg-white/20 backdrop-blur-2xl
                border border-[#d4b25f]
                p-8 rounded-3xl
                shadow-[0_20px_60px_rgba(0,0,0,0.3)]
                overflow-hidden
              "
                        >

                            {/* SPOTLIGHT */}
                            <div className="
                absolute inset-0 opacity-0 group-hover:opacity-100
                transition duration-500
                bg-[radial-gradient(circle_at_center,rgba(212,178,95,0.4),transparent_70%)]
              " />

                            {/* STITCH LINE */}
                            <div className="
                absolute bottom-0 left-0 h-[2px] w-0
                bg-[#d4b25f]
                group-hover:w-full
                transition-all duration-500
              " />

                            {/* TITLE */}
                            <h3 className="relative z-10 text-xl font-semibold text-[#5c4b2c]">
                                {c.title}
                            </h3>

                            {/* DESC */}
                            <p className="relative z-10 mt-2 text-sm text-[#7a6742]">
                                Manage your work efficiently →
                            </p>

                            {/* SHINE */}
                            <div className="
                absolute inset-0 opacity-0 group-hover:opacity-100
                transition duration-700
                bg-gradient-to-r from-transparent via-white/20 to-transparent
                translate-x-[-100%] group-hover:translate-x-[100%]
              " />

                        </motion.div>
                    ))}

                </div>
            </div>
 {/* FOOTER */}
            <div className="text-center text-[#8c7440] pb-6 opacity-70">
                Precision meets craftsmanship ✂️
            </div>

        </motion.div>
    );
}

/* ================= ROUTER ================= */
export default function TailorDashboard() {
    return (
  
            <Routes>
                <Route path="/" element={<TailorHome />} />
                <Route path="/complete-orders" element={<CompleteOrders />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/status" element={<OrderStatus />} />
                <Route path="/profile" element={<TailorProfile />} />
            </Routes>
  
    );
}