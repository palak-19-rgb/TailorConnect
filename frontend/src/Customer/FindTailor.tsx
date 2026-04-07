import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function TailorMarketplace() {
const navigate = useNavigate();
const [tailors, setTailors] = useState<any[]>([]);
const [city,setCity] = useState("")
const [workType,setWorkType] = useState("")
const [experience,setExperience] = useState("")
const [error,setError] = useState("")
const [formError,setFormError] = useState("")

// 🔥 NEW STATES
const [selectedTailor,setSelectedTailor] = useState<any>(null)
const [portfolio,setPortfolio] = useState<any[]>([])
const [showModal,setShowModal] = useState(false)
const [showWork,setShowWork] = useState(false)
const [selectedImage, setSelectedImage] = useState<any>(null)

/* ---------------- VALIDATION ---------------- */
const validateFilters = () => {
  if(city && city.length < 2){
    setFormError("Enter valid city name")
    return false
  }

  if(workType && !["Home","Shop","Both"].includes(workType)){
    setFormError("Invalid work type")
    return false
  }

  setFormError("")
  return true
}

/* ---------------- FETCH ---------------- */
const fetchTailors = async () => {
if(!validateFilters()) return

try{
const res = await API.get("/tailor/tailors",{
params:{
  city,
  workType,
  experience: experience ? Number(experience) : ""
}
})

const data = res.data

if(data.message){
setError(data.message)
setTailors([])
}else{
setError("")
setTailors(data)
}

}catch(err){
console.log(err)
}
}

/* ---------------- PROFILE OPEN ---------------- */
const openProfile = async (tailor:any) => {
  try {
    setSelectedTailor(tailor)
    setShowModal(true)
    setShowWork(false)

   const res = await API.get(
  `/tailor/get-portfolio/${tailor.email}`
)
    setPortfolio(res.data || [])

  } catch (err) {
    console.log(err)
  }
}

/* ---------------- SAVE ---------------- */
const saveTailor = async (tailorId:any) => {
  try {
  const email = localStorage.getItem("email");
await API.post("/customer/save-tailor", {
  email,
  tailorId
});
    alert("Saved ❤️");
  } catch (err) {
    console.log(err);
  }
};

/* ---------------- FILTER ---------------- */
const filteredTailors = tailors.filter((t:any)=>{

  if (workType) {
    if (workType === "Home" && !["Home","Both"].includes(t.workType)) return false
    if (workType === "Shop" && !["Shop","Both"].includes(t.workType)) return false
    if (workType === "Both" && t.workType !== "Both") return false
  }

  if (experience && Number(t.experience) < Number(experience)) return false

  return true
})

useEffect(()=>{
fetchTailors()
},[])

/* ---------------- UI ---------------- */
return (

<div className="min-h-screen bg-gradient-to-br from-[#fdf8ec] via-[#f6ecd3] to-[#ead39a] p-10 font-serif">

{/* HEADER */}
<div className="text-center mb-14 ">
<h1 className="text-5xl text-[#b8963f] tracking-wide ">
Find a Tailor
</h1>
<p className="text-[#7a6742] mt-3 tracking-[3px] uppercase text-xs">
Discover Skilled Tailors
</p>
</div>

<div className="flex gap-10 max-w-7xl mx-auto">

{/* FILTER PANEL */}
<div className="w-72 bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-[#e3c98b]">

<h3 className="text-lg text-[#b8963f] mb-6">
Search Filters
</h3>

<div className="space-y-4">

<div className="border border-dashed border-[#d4b25f] rounded-lg p-2">
<input
placeholder="City"
value={city}
onChange={(e)=>setCity(e.target.value)}
className="w-full bg-white text-black text-sm px-3 py-2 rounded"
/>
</div>

<div className="border border-dashed border-[#d4b25f] rounded-lg p-2">
<select
value={workType}
onChange={(e)=>setWorkType(e.target.value)}
className="w-full bg-white text-black text-sm px-3 py-2 rounded"
>
<option value="">All Work Type</option>
<option value="Home">Home</option>
<option value="Shop">Shop</option>
<option value="Both">Both</option>
</select>
</div>

<div className="border border-dashed border-[#d4b25f] rounded-lg p-2">
<select
value={experience}
onChange={(e)=>setExperience(e.target.value)}
className="w-full bg-white text-black text-sm px-3 py-2 rounded"
>
<option value="">Experience</option>
<option value="5">5+ Years</option>
<option value="10">10+ Years</option>
<option value="20">20+ Years</option>
</select>
</div>

{formError && (
<p className="text-red-500 text-xs">{formError}</p>
)}

<button
onClick={fetchTailors}
className="w-full py-2 rounded-lg bg-[#b8963f] text-white text-sm"
>
Find Tailors
</button>

</div>
</div>

{/* LIST */}
<div className="flex-1">

{error && (
<div className="text-center py-20">
<h2 className="text-2xl text-[#b8963f] mb-2">
No Tailor Found
</h2>
<p className="text-[#7a6742] text-sm">
Try different filters
</p>
</div>
)}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

{filteredTailors.map((tailor)=>(
<div key={tailor._id}
className="bg-white/40 backdrop-blur-xl border border-[#e3c98b] rounded-3xl p-5 shadow">

<h3 className="font-semibold text-[#5c4b2c]">
{tailor.ownerName}
</h3>

<p className="text-sm text-[#7a6742]">
📍 {tailor.shopAddress?.city}
</p>

<div className="flex gap-2 mt-3">
<span className="bg-[#f6ecd3] text-[#b8963f] text-xs px-2 py-1 rounded">
{tailor.experience}+ yrs
</span>

<span className="bg-[#efe3c3] text-[#7a663a] text-xs px-2 py-1 rounded">
{tailor.workType}
</span>
</div>

<div className="grid grid-cols-3 gap-3 mt-5">




<button
  onClick={() => {
  const myEmail = localStorage.getItem("email")?.trim().toLowerCase();
const other = tailor.email?.trim().toLowerCase();

console.log("MY:", myEmail);
console.log("OTHER:", other);

if (!other) {
  alert("❌ Tailor email missing");
  return;
}

if (other === myEmail) {
  alert("❌ Cannot chat with yourself");
  return;
}

localStorage.setItem("chatUser", other);

navigate("/chat", {
  state: { otherUser: other }
});
  }}
  className="py-2 bg-[#b8963f] text-white rounded-md text-sm w-full rounded shadow hover:scale-105 transition"
>
  Chat 
</button>



<button
onClick={()=>openProfile(tailor)}
className="mpy-2 bg-[#b8963f] text-white rounded-md text-sm w-full rounded shadow hover:scale-105 transition ">
Profile
</button>

<button
onClick={async () => {
  await saveTailor(tailor._id);
  alert("❤️ Your favorite tailor saved!");
}}
className="py-2 bg-[#f6ecd3] text-[#b8963f] rounded-md w-full rounded shadow hover:scale-105 transition">
♡
</button>

</div>

</div>
))}

</div>

</div>

</div>

{/* 🔥 MODAL */}
{showModal && selectedTailor && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">

    <div className="relative w-[700px] max-h-[85vh] overflow-y-auto
    bg-white/20 backdrop-blur-2xl
    border border-[#e3c98b]/50
    rounded-3xl p-6
    shadow-[0_25px_80px_rgba(0,0,0,0.3)]">


      {/* CLOSE */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 text-[#b8963f] text-xl hover:scale-110 transition"
      >
        ✕
      </button>

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6 border-b border-[#e3c98b]/40 pb-4">

        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d6be7b] to-[#b8963f] flex items-center justify-center text-white text-xl font-bold shadow">
          {selectedTailor.ownerName?.charAt(0)}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#5c4b2c]">
            {selectedTailor.ownerName}
          </h2>
          <p className="text-sm text-[#7a6742]">
            📍 {selectedTailor.shopAddress?.city}
          </p>
        </div>

      </div>

      {/* DETAILS CARDS */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">

        <div className="bg-white/30 backdrop-blur-md p-3 rounded-xl border border-[#e3c98b]/40">
          📞 {selectedTailor.phone}
        </div>

        <div className="bg-white/30 backdrop-blur-md p-3 rounded-xl border border-[#e3c98b]/40">
          ✉ {selectedTailor.email || "Not available"}
        </div>

        <div className="bg-white/30 backdrop-blur-md p-3 rounded-xl border border-[#e3c98b]/40">
          ⏳ {selectedTailor.experience} yrs experience
        </div>

        <div className="bg-white/30 backdrop-blur-md p-3 rounded-xl border border-[#e3c98b]/40">
          🧵 {selectedTailor.workType}
        </div>

      </div>

      {/* ACTION BUTTON */}
      <div className="mb-6">
        <button
          onClick={() => setShowWork(!showWork)}
          className="w-full py-2 rounded-xl
          bg-transparent border border-[#b8963f]
          text-[#b8963f]
          hover:bg-[#b8963f] hover:text-white
          transition duration-300"
        >
          {showWork ? "Hide Work" : "View My Work"}
        </button>
      </div>

      {/* 🔥 PORTFOLIO */}
      {showWork && (
        <div>

          <h3 className="text-lg text-[#b8963f] mb-4">
            Portfolio
          </h3>

          {portfolio.length === 0 ? (
            <p className="text-sm text-gray-500">
              No work uploaded yet
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-4">

              {portfolio.map((img: any) => (
                <div
                  key={img._id}
                  className="group relative rounded-xl overflow-hidden border border-[#e3c98b]/40 shadow-sm"
                >
<img
  src={img.imageUrl}
  onClick={() => {
    console.log("clicked"); // test
    setSelectedImage(img);
  }}
  className="w-full h-32 object-cover cursor-pointer relative z-10"
/>

                  {/* overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-end p-2 pointer-events-none">
                    <p className="text-white text-xs">
                      {img.description || "No description"}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      )}

    </div>
  </div>
)}
{/* ✅ IMAGE PREVIEW MODAL (SABSE BAHAR) */}
{selectedImage &&  showModal &&  (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]">

    <div className="relative max-w-3xl w-full px-4">

      <button
        onClick={() => setSelectedImage(null)}
        className="absolute -top-10 right-2 text-white text-2xl"
      >
        ✕
      </button>

    <img
  src={selectedImage.imageUrl}
  className="w-full max-h-[70vh] object-contain rounded-3xl"
/>

      <div className="mt-3 bg-black/40 backdrop-blur-md rounded-lg p-3 text-sm text-white">
        {selectedImage.description || "No description available"}
      </div>

    </div>

  </div>
)}
</div> 
)
}