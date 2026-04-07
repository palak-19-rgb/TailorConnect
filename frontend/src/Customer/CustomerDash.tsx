import {  Routes, Route, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

import CustomerProfile from "./CustomerProfile";
import FindTailors from "./FindTailor";
import MyMeasurements from "./MyMeasurement";
import MyOrders from "./Myorders";
import SavedTailors from "./SavedTailors";
import API from "../api/api";


/* ================= HERO ================= */
function HeroSection() {
  const [customer, setCustomer] = useState<any>(null);
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



const handleLogout = () => {
  localStorage.clear(); // user data hatao
  window.location.href = "/"; // Hero.tsx route (home)
};



  const bgX = useTransform(mouseX, [0, window.innerWidth], [-12, 12]);
  const bgY = useTransform(mouseY, [0, window.innerHeight], [-12, 12]);

  const lightX = useTransform(mouseX, [0, window.innerWidth], [-120, 120]);
  const lightY = useTransform(mouseY, [0, window.innerHeight], [-120, 120]);

  return (
    <div className="relative h-[65vh] w-full overflow-hidden rounded-b-[50px]">

      {/* 🧵 FABRIC BG */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 bg-[url('/fabric.jpg')] bg-cover bg-center scale-110 brightness-[0.6]"
      />

      {/* 🎨 COLOR */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b2f1c]/70 via-[#5c4b2c]/60 to-[#c9a75f]/50" />

      {/* ✨ FABRIC SHADER */}
      <motion.div
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute inset-0 bg-[url('/grain.png')] mix-blend-overlay"
      />

      {/* 💡 LIGHT */}
      <motion.div
        style={{ x: lightX, y: lightY }}
        className="absolute w-[320px] h-[320px] rounded-full bg-[#e3c98b]/20 blur-3xl"
      />


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

      {/* 💎 CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm tracking-[4px] text-[#e3c98b]/80 uppercase"
        >
          Tailored Experience
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="
            mt-3
            text-4xl md:text-5xl font-serif font-semibold
            bg-gradient-to-r from-[#f5e6b3] via-[#d4b25f] to-[#b8963f]
            bg-clip-text text-transparent
            drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)]
          "
        >
      {customer?.name ? `Welcome ${customer.name}` : ""}


        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="
            mt-4
            text-[#f5e6b3]/80
            max-w-lg
            text-sm md:text-base
            leading-relaxed
          "
        >
          Where every stitch reflects precision, and every detail feels personal.
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "90px" }}
          transition={{ delay: 0.5 }}
          className="h-[1px] bg-[#d4b25f] mt-6"
        />

      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function DashboardHome() {
  const nav = useNavigate();






const [profileComplete, setProfileComplete] = useState(false);
 useEffect(() => {
  const email = localStorage.getItem("email");
  if (!email) return;

  API.get(`/Customer/getByEmail/${email}`)
    .then(res => {
      const user = res.data;

      // ✅ simple check (name + phone hona chahiye)
      if (user?.name && user?.phone) {
        setProfileComplete(true);
      } else {
        setProfileComplete(false);
      }
    })
    .catch(() => setProfileComplete(false));
}, []);







  const cards = [
  { title: "👤Profile", path: "profile" },
  { title: "📏My Measurements", path: "my-measurements" },
  { title: "🧾My Orders", path: "my-orders" },
  { title: "🔍Find Tailors", path: "find-tailors" },
  { title: "❤️Saved Tailors", path: "saved-tailors" },
];


useEffect(() => {
  const handleBack = (e: PopStateEvent) => {
    const confirmLogout = window.confirm("Do you want to logout?");

    if (confirmLogout) {
      localStorage.clear();
      nav("/");
    } else {
      window.history.pushState(null, "", window.location.pathname);
    }
  };

  window.history.pushState(null, "", window.location.pathname);
  window.addEventListener("popstate", handleBack);

  return () => {
    window.removeEventListener("popstate", handleBack);
  };
}, []);   // ✅ YE ADD KAR


  const testimonials = [
    "Impeccable stitching and fit.",
    "Feels like couture, not just tailoring.",
    "Elegant experience from start to finish.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-[#fdf8ec] via-[#f6ecd3] to-[#ead39a] min-h-screen"
    >

      <HeroSection />

      {/* CARDS */}
      <div className="px-10 py-16">
        <h2 className="text-3xl font-serif text-[#b8963f] mb-10 text-center">
          Explore
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
                bg-white/30 backdrop-blur-2xl
                border border-[#e3c98b]
                p-8 rounded-3xl
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                overflow-hidden
              "
            >

              {/* LIGHT */}
              <div className="
                absolute inset-0 opacity-0 group-hover:opacity-100
                transition duration-500
                bg-[radial-gradient(circle_at_center,rgba(212,178,95,0.35),transparent_70%)]
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
              <p className="relative z-10 mt-2 text-sm text-[#7a6742] opacity-80">
                Seamlessly manage your tailoring experience →
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



      {/* TESTIMONIALS */}
      <div className="px-10 pb-20 text-center">

        <h2 className="text-2xl font-serif text-[#8c7440] mb-8">
          Refined Experiences
        </h2>

        <div className="flex flex-wrap justify-center gap-6">

          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="
                w-[260px]
                bg-white/20 backdrop-blur-xl
                border border-[#e3c98b]
                p-6 rounded-2xl
                shadow-[0_10px_30px_rgba(0,0,0,0.2)]
              "
            >
              <p className="text-[#5c4b2c] italic text-sm">“{t}”</p>
            </motion.div>
          ))}

        </div>

      </div>



      {/* FOOTER */}
      <div className="text-center text-[#b8963f] pb-6 opacity-70">
        Crafted with elegance ✨
      </div>

    </motion.div>

  );
}

/* ================= ROUTER ================= */
export default function CustomerDashboard() {
  return (
      <Routes>
        
        <Route path="/" element={<DashboardHome />} />
        <Route path="/find-tailors" element={<FindTailors />} />
        <Route path="/my-measurements" element={<MyMeasurements />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/saved-tailors" element={<SavedTailors />} />
        <Route path="/profile" element={<CustomerProfile />} />
      </Routes>
  );
}