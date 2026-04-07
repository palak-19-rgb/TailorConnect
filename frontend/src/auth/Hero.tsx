import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import heroImg from "../assets/image.png";
import Login from "./Login";
import Signup from "./Signup";


export default function Hero() {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [quote, setQuote] = useState("");

  const [showLogin, setShowLogin] = useState(false);
const [showSignup, setShowSignup] = useState(false);
useEffect(() => {
  setTimeout(() => setLoaded(true), 300);

  // 🔥 RANDOM QUOTE
  const random = Math.floor(Math.random() * quotes.length);
  setQuote(quotes[random]);

  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScroll) setShowNav(false);
    else setShowNav(true);
    lastScroll = window.scrollY;
  });
}, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);






const quotes = [
  `Fading light over textured fabrics,
  where every silhouette is shaped with intent —
  a quiet harmony between the artisan’s hand
  and the wearer’s story.`,

  `In the rhythm of needle and thread,
  lies a language unspoken —
  where garments are not created,
  but slowly brought to life.`,

  `Soft drapes, measured cuts,
  and time held gently in every stitch —
  this is where craftsmanship becomes emotion,
  and clothing becomes memory.`
];



  const images = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg","image5.jpg","image6.jpg","image7.jpg","image8.jpg","image9.jpg","image10.jpg"];

  const fabrics = [
  {
    name: "Chikankari",
    img: "/fabrics/chikan.jpg",
    origin: "Lucknow, India",
    desc: "Born in the courts of Awadh, Chikankari whispers elegance through delicate hand embroidery, where every thread carries centuries of grace."
  },
  {
    name: "Banarasi Silk",
    img: "/fabrics/silk.jpg",
    origin: "Varanasi, India",
    desc: "Woven with gold and tradition, Banarasi silk reflects royalty — a fabric once reserved for queens and timeless celebrations."
  },
  {
    name: "Jaipuri Prints",
    img: "/fabrics/jaipur.jpg",
    origin: "Jaipur, India",
    desc: "Crafted with age-old block printing techniques, these vibrant patterns echo the colors of Rajasthan’s rich heritage."
  },
  {
    name: "Linen",
    img: "/fabrics/linen.jpg",
    origin: "Global Heritage",
    desc: "Light, breathable and effortless — linen speaks a language of quiet luxury and modern minimalism."
  },
  {
    name: "Velvet",
    img: "/fabrics/velvet.jpg",
    origin: "Mughal Era Influence",
    desc: "Deep, rich and indulgent — velvet carries the grandeur of royal courts and timeless opulence."
  },
  {
    name: "Hand Embroidery",
    img: "/fabrics/embroidery.jpg",
    origin: "Across India",
    desc: "From mirror work to thread art, every stitch tells a story shaped by skilled artisan hands."
  }
];

  return (
    <div className="w-full overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: showNav ? 0 : -100, opacity: showNav ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 w-full z-50 px-12 py-5 flex justify-between items-center
backdrop-blur-xl bg-gradient-to-b from-black/60 to-transparent border-b border-white/10">
        {/* LOGO */}
       <h1 className="text-[#EAD8B1] tracking-[6px] text-xl font-light">
  TAILOR CONNECT
</h1>

        {/* NAV LINKS */}
        <div className="flex gap-10 text-[#EAD8B1] text-sm">

          {[
            { name: "Portfolio", id: "portfolio" },
            { name: "Craft", id: "craft" },
            { name: "Experience", id: "experience" }
          ].map((item, i) => (
            <span
              key={i}
              onClick={() =>
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
              }
              className="cursor-pointer relative group"
            >
              {item.name}

              {/* underline animation */}
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#C6A75E] group-hover:w-full transition-all duration-300"></span>
            </span>
          ))}

        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
         onClick={() => {
  setShowLogin(true);
  setShowSignup(false);
}}


            className="px-4 py-1 border border-[#C6A75E] rounded-full text-[#EAD8B1] hover:bg-[#C6A75E] hover:text-black transition"
          >
            Login
          </button>

          <button
          onClick={() => {
  setShowSignup(true);
  setShowLogin(false);
}}
            className="px-5 py-1 rounded-full bg-gradient-to-r from-[#C6A75E] to-[#E6C57E] text-black hover:scale-105 transition"
          >
           Signup
          </button>
        </div>
      </motion.div>

      {/* ================= HERO ================= */}
      <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className={`w-full overflow-x-hidden ${showLogin || showSignup ? "blur-md" : ""}`}></div>

        <motion.img
          src={heroImg}
          style={{ scale, y }}
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30"></div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 60 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-6xl text-[#F5E6C8] mb-4">
            Timeless Craftsmanship
          </h1>

          <p className="text-[#EAD8B1] max-w-2xl mx-auto">
            Where every stitch becomes a conversation between the artisan and the wearer.
          </p>
        </motion.div>
{(showLogin || showSignup) && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center">

    {/* BACKGROUND DIM */}
    <div className="absolute inset-0 bg-black/50"></div>

    {/* BOX */}
    <div className="relative z-50 w-full max-w-md p-8 rounded-2xl
    bg-[#FFF8EC] shadow-2xl border border-[#C6A75E]/30">

      {/* ❌ CLOSE BUTTON (NOW PERFECT) */}
      <button
        onClick={() => {
          setShowLogin(false);
          setShowSignup(false);
        }}
       className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
rounded-full bg-black/30 text-white
hover:bg-black/50 transition backdrop-blur-sm"
      >
        ✕
      </button>

     {showLogin && !showSignup && (
  <Login 
    setShowSignup={setShowSignup} 
    setShowLogin={setShowLogin} 
  />
)}

{showSignup && !showLogin && (
  <Signup 
    setShowLogin={setShowLogin} 
    setShowSignup={setShowSignup} 
  />
)}
    </div>
  </div>
)}

        {/* ✨ CURTAIN OPEN */}
<motion.div
  initial={{ x: 0 }}
  animate={{ x: loaded ? "-100%" : 0 }}
  transition={{ duration: 1.2, ease: "easeInOut" }}
  className="absolute left-0 top-0 w-1/2 h-full bg-black z-20"
/>

<motion.div
  initial={{ x: 0 }}
  animate={{ x: loaded ? "100%" : 0 }}
  transition={{ duration: 1.2, ease: "easeInOut" }}
  className="absolute right-0 top-0 w-1/2 h-full bg-black z-20"
/>

      </section>

      {/* ================= QUOTE ================= */}
     <section className="bg-[#1a1a1a] py-32 text-center px-6">

  <motion.h2
    key={quote}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="text-3xl md:text-4xl text-[#EAD8B1] max-w-4xl mx-auto leading-relaxed whitespace-pre-line font-light"
  >
    {quote}
  </motion.h2>

</section>

      {/* ================= PORTFOLIO ================= */}
      <section id="portfolio" className="bg-[#E6D7C5] py-20">

        <div className="overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex gap-10 w-max px-10"
          >
            {[...images, ...images].map((img, i) => (
              <div key={i} className="min-w-[300px] h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <img src={`/portfolio/${img}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </motion.div>
        </div>

      </section>

      {/* ================= FABRICS ================= */}
      <section id="craft" className="bg-[#f5ede3] py-32 px-10">

        <h2 className="text-4xl text-center text-[#5C3A21] mb-16">
          Textures & Traditions
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {fabrics.map((fab, i) => (
          <motion.div
  key={i}
  whileHover={{ scale: 1.03 }}
  className="relative h-[260px] rounded-2xl overflow-hidden group cursor-pointer"
>

  {/* 🔥 BACKGROUND IMAGE (DEFAULT VIEW) */}
  <img
    src={fab.img}
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>

  {/* NAME (always visible subtle) */}
  <div className="absolute bottom-4 left-4 z-10">
    <h3 className="text-[#EAD8B1] text-lg tracking-wide">
      {fab.name}
    </h3>
  </div>

  {/* ✨ HOVER GLASS CARD */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileHover={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="absolute inset-0 backdrop-blur-xl bg-white/20 border border-white/30 
               rounded-2xl p-5 opacity-0 group-hover:opacity-100 flex flex-col justify-between"
  >

    {/* TOP */}
    <div>
      <h3 className="text-[#3e2c1c] font-semibold text-lg">
        {fab.name}
      </h3>
      <p className="text-xs text-[#6b4f2d] italic">
        {fab.origin}
      </p>
    </div>

    {/* DESC */}
    <p className="text-sm text-[#3e2c1c] leading-relaxed mt-3">
      {fab.desc}
    </p>

  </motion.div>
</motion.div>
          ))}

        </div>

      </section>

      {/* ================= VIDEO ================= */}
  <section id="experience" className="relative h-[90vh] flex items-center justify-center overflow-hidden">

  {/* VIDEO BACKGROUND */}
  <video
    src="/videos/fashion.mp4"
    autoPlay
    loop
    muted
    className="absolute w-full h-full object-cover"
  />

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* TEXT CONTENT */}
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="relative z-10 text-center max-w-3xl px-6"
  >
    <h2 className="text-5xl text-[#EAD8B1] mb-6 tracking-wide">
      Experience the Craft
    </h2>

    <p className="text-[#EAD8B1] leading-relaxed text-lg">
      In the quiet rhythm of measurements and muslin,
      a garment begins to take shape —
      not just stitched, but understood.
      <br /><br />
      Between the artisan’s intuition and the wearer’s vision,
      lies a journey of trust, detail, and timeless elegance.
    </p>
  </motion.div>
</section>





{/* ================= FOOTER ================= */}

<motion.footer
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  viewport={{ once: true }}
  className="bg-[#0f0f0f] text-[#EAD8B1] px-10 py-16"
>

  <div className="grid md:grid-cols-3 gap-10">

    {/* BRAND */}
    <div>
      <h2 className="text-xl tracking-[5px] mb-4">TAILOR CONNECT</h2>
      <p className="text-sm text-[#cbb98f] leading-relaxed">
        Where craftsmanship meets connection — bridging artisans and
        individuals through timeless tailoring and thoughtful design.
      </p>
    </div>

    {/* ❌ EXPLORE HATA DIYA → ✅ PHILOSOPHY */}
    <div>
      <h3 className="mb-4 text-[#C6A75E]">Philosophy</h3>

      <p className="text-sm text-[#cbb98f] leading-relaxed">
        Rooted in tradition, shaped by precision —
        every garment reflects a balance of heritage
        and contemporary expression.
      </p>
    </div>

    {/* CONTACT */}
    <div>
      <h3 className="mb-4 text-[#C6A75E]">Connect</h3>

      <p className="text-sm text-[#cbb98f]">
        tailorconnect@gmail.com
      </p>

      {/* 🔥 REAL LINKS */}
      <div className="flex gap-4 mt-4">

        <a
          href="https://instagram.com"
          target="_blank"
          className="cursor-pointer hover:text-white transition"
        >
          Instagram
        </a>

        <a
          href="https://linkedin.com"
          target="_blank"
          className="cursor-pointer hover:text-white transition"
        >
          LinkedIn
        </a>

        <a
          href="mailto:tailorconnect@gmail.com"
          className="cursor-pointer hover:text-white transition"
        >
          Gmail
        </a>

      </div>
    </div>

  </div>

  {/* BOTTOM */}
  <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-[#a8976d]">
    © 2026 Tailor Connect — Designed with precision
  </div>

</motion.footer>
</div>
  );
}