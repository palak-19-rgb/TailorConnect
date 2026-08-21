import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

type Customer = {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  outfit?: string;
  lastVisit?: string;
  deliveryDate: string;
  measurements: {
    [key: string]: string;
  };
  status?: string;
   email?: string;  
};


export default function Customers() {


  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mode, setMode] = useState("new");
  const [search, setSearch] = useState("");
const [isListening, setIsListening] = useState(false);
const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    outfit: "",
    deliveryDate: "",
    email: ""
  });
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const tailorId = localStorage.getItem("tailorId");

      if (!tailorId) {
        console.log("No tailorId found");
        return; // ❌ API call mat kar
      }
const res = await fetch(
  `https://tailorconnect-backend.onrender.com/TailorCustomer/${tailorId}`,
  { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
);

      const data = await res.json();

      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCustomers([]);
      console.log(localStorage.getItem("tailorId"));
    }
  };

  const fields = ["chest", "waist", "hip", "shoulder", "sleeve", "length"];

  const filteredCustomers = customers.filter(
    (c) =>
      c &&
      c.name &&
      (
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
      )
  );
  const addCustomer = async () => {
    if (!form.phone || form.phone.length < 10) {
      alert("Valid phone number required");
      return;
    }

    if (mode === "new" && !form.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!form.outfit.trim()) {
      alert("Outfit is required");
      return;
    }

    if (!form.deliveryDate) {
      alert("Delivery date required");
      return;
    }
    try {
      const tailorId = localStorage.getItem("tailorId");

      // ✅ Fix
const res = await fetch("https://tailorconnect-backend.onrender.com/TailorCustomer/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          tailorId,
          ...form,
          status: "Pending"
        })
      });

      const data = await res.json();

      if (data.status) {
        await fetchCustomers();

        // ✅ modal close
        setShowForm(false);

        // ✅ form clear
        setForm({
          name: "",
          phone: "",
          address: "",
          outfit: "",
          deliveryDate: "",
            email: ""
           
        });
      }
    } catch (err) {
      console.error(err);
    }
  };



  const deleteCustomer = async (id: string) => {
    const confirmDelete = window.confirm("Delete this customer?");
    if (!confirmDelete) return;
  await fetch("https://tailorconnect-backend.onrender.com/TailorCustomer/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ id })
    });
    setCustomers(prev => prev.filter(c => c._id !== id));
  };


  const updateMeasurement = (id: string, field: string, value: string) => {
    setCustomers(prev =>
      prev.map(c =>
        c._id === id
          ? {
            ...c,
            measurements: {
              ...c.measurements,
              [field]: value
            }
          }
          : c
      )
    );
  };

  const handlePhoneBlur = async () => {
    if (mode !== "existing" || !form.phone) return;

    const res = await API.get(`/Customer/check/${encodeURIComponent(form.phone)}`);
    const data = res.data;

    if (data.exists) {
      setForm(prev => ({
        ...prev,
        name: data.customer.name,
        address: data.customer.address?.street || data.customer.address?.city || ""
      }));
    } else {
      alert("Customer not found");
    }
  };


  const saveMeasurements = async (id: string, measurements: any) => {


  const hasEmpty = Object.values(measurements || {}).some(
  (val) => !val || (val as string).trim() === ""
);

    if (hasEmpty) {
      alert("Please fill all measurements");
      return;
    }
 await fetch(
"https://tailorconnect-backend.onrender.com/TailorCustomer/update-measurements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ id, measurements })
    });
    await fetchCustomers(); // refresh list
    alert("Measurements saved ✅");
  };


const startVoiceInput = (customerId: string) => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input not supported in this browser. Use Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  setIsListening(true);
  setActiveCustomerId(customerId);
  recognition.start();

  recognition.onresult = (event: any) => {
  const raw = event.results[0][0].transcript.toLowerCase();
console.log("Voice:", raw);

// ✅ common misheard words fix
const transcript = raw
  .replace(/chess/g, "chest")
  .replace(/\bwest\b/g, "waist")
  .replace(/\bwrist\b/g, "waist")
  .replace(/sleeves/g, "sleeve")
  .replace(/soldier/g, "shoulder")
  .replace(/elder/g, "shoulder")
  .replace(/\./g, " "); 
    const patterns: { [key: string]: RegExp } = {
  chest:    /ch(?:est|ess|es|Chess|chess)\s*(\d+)/i,
  waist:    /w(?:aist|est|aste|rist)\s*(\d+)/i,
  hip:      /hip\s*(\d+)/i,
  shoulder: /sh(?:oulder|older|ouder)\s*(\d+)/i,
  sleeve:   /sl(?:eeve|eeves|eve|eves)\s*(\d+)/i,
  length:   /l(?:ength|enth|enght)\s*(\d+)/i,
};

  let updated = false;
Object.entries(patterns).forEach(([field, regex]) => {
  const match = transcript.match(regex);
  console.log(`Trying ${field}:`, regex, "→ match:", match);
  if (match) {
    updateMeasurement(customerId, field, match[1]);
    updated = true;
  }
});

    if (!updated) {
      alert(`Could not parse: "${transcript}". Try saying "chest 38 waist 32"`);
    }
  };

  recognition.onerror = () => {
    setIsListening(false);
    setActiveCustomerId(null);
  };

  recognition.onend = () => {
    setIsListening(false);
    setActiveCustomerId(null);
  };
};







  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8ec] via-[#f7edd4] to-[#e8c77a] px-6 py-10 font-serif">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl text-[#b8963f] tracking-widest font-semibold">
          Client Atelier
        </h1>

        <p className="text-center text-[#8c7440] mt-2 text-sm tracking-wide">
          Curating elegance, one stitch at a time ✨
        </p>
      </div>
      {/* SEARCH */}

      <div className="flex justify-center mb-6">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[300px] px-4 py-2 rounded-full bg-[#fffaf0] border border-[#e6d3a3] text-black
          focus:outline-none focus:ring-2 focus:ring-[#c6a75a]"
        />
      </div>





      {/* ADD BUTTON */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => setShowForm(true)}
          className="px-10 py-3 rounded-full bg-gradient-to-r from-[#d4b25f] to-[#b8963f] text-white
          shadow-lg hover:scale-105 transition"
        >
          ✨ Add Client
        </button>
      </div>









      {/* MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-2xl w-[350px] space-y-3"
            >

              <h2 className="text-center text-[#b8963f]">New Client</h2>



              <button
                onClick={() => setMode("new")}
                className={`flex-1 py-2 rounded transition-colors ${mode === "new"
                  ? "bg-[#a8842f] text-white"
                  : "bg-[#d6c08a] text-[#5f4a1a] hover:bg-[#c9b06f]"
                  }`}
              >
                New Client
              </button>

              <button
                onClick={() => setMode("existing")}
                className={`flex-1 py-2  gap-3 rounded transition-colors ${mode === "existing"
                  ? "bg-[#a8842f] text-white"
                  : "bg-[#d6c08a] text-[#5f4a1a] hover:bg-[#c9b06f]"
                  }`}
              >
                Existing
              </button>


              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                onBlur={mode === "existing" ? handlePhoneBlur : undefined}
                className="w-full px-3 py-2 bg-[#fffaf0] text-black border border-[#e6d3a3] rounded"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#fffaf0] text-black border border-[#e6d3a3] rounded"
              />

              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#fffaf0] text-black border border-[#e6d3a3] rounded"
              />


              {mode === "new" && (
                <input
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#fffaf0] text-black border border-[#e6d3a3] rounded outline-none caret-black placeholder:text-gray-500 focus:bg-[#fff3d6] focus:text-black"

                />
              )}
              <input
                placeholder="Outfit"
                value={form.outfit}
                onChange={(e) => setForm({ ...form, outfit: e.target.value })}
                className="w-full px-3 py-2 bg-[#fffaf0] text-black border border-[#e6d3a3] rounded outline-none caret-black placeholder:text-gray-500 focus:bg-[#fff3d6] focus:text-black"

              />


              <input
                type="date"
                value={form.deliveryDate}
                onChange={(e) =>
                  setForm({ ...form, deliveryDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#fffaf0] text-black border border-[#e6d3a3] rounded outline-none caret-black placeholder:text-gray-500 focus:bg-[#fff3d6] focus:text-black"
              />


              <div className="flex gap-2">
                <button
                  onClick={addCustomer}
                  className="flex-1 py-2 bg-[#cdb57a] text-[#5f4a1a] rounded hover:bg-[#bfa567] transition"
                >
                  Save
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 bg-[#eee] rounded"
                >
                  Cancel
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6 items-start auto-rows-max">

        {filteredCustomers.map((c, index) => (
          <div key={c._id} className="bg-white p-5 rounded-2xl shadow">

            {/* BASIC INFO */}
            <div className="space-y-1 mb-3">
              <h2 className="text-[#b8963f] font-semibold">{c.name}</h2>
              <p className="text-sm text-gray-600">📞 {c.phone}</p>

              <div className="flex justify-between text-xs text-[#8c7440]">
                <span>📍 {c.address}</span>
                <span>🧵 {c.outfit}</span>
              </div>

              <p className="text-xs mt-1 inline-block px-2 py-1 rounded-full bg-red-50 text-red-500">
                📅 Delivery: {c.deliveryDate}
              </p>
            </div>



<button
  onClick={() => {
    const myEmail = localStorage.getItem("email")?.trim().toLowerCase();

    // ❌ OLD
    // const other = c.email?.trim().toLowerCase();

    // ✅ NEW (FORCE FIX)
    if (!c.email) {
      alert("❌ Customer email missing");
      return;
    }

  const other = (c.email as string).trim().toLowerCase();

    if (other === myEmail) {
      alert("❌ Cannot chat with yourself");
      return;
    }

    console.log("MY:", myEmail);
    console.log("OTHER:", other);

    localStorage.setItem("chatUser", other);

    navigate("/chat", {
      state: { otherUser: other }
    });
  }}
   className="mt-3 w-full py-2 
  bg-gradient-to-r from-[#d4b25f] to-[#b8963f] 
  text-white text-sm font-medium 
  shadow hover:scale-105 transition"
>

  Chat 💬
</button>



            {/* TOGGLE */}
            <button
              onClick={() =>
                setOpenId(openId === c._id ? null : c._id)
              }
              className="mt-2 w-full py-2 text-xs bg-[#b8963f] text-white rounded shadow hover:scale-105 transition"
            >
              Measurements
            </button>

            {/* MEASUREMENTS */}
            {openId === c._id && (
              <div className="mt-3">

<button
  type="button"
  onClick={() => startVoiceInput(c._id)}
  className={`w-full mb-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
    ${isListening && activeCustomerId === c._id
      ? "bg-red-500 text-white animate-pulse shadow-lg"
      : "bg-[#f3e2b4] text-[#b8963f] border border-[#d4b25f] hover:bg-[#d4b25f] hover:text-white"
    }`}
>
  {isListening && activeCustomerId === c._id
    ? "🎙️ Listening... (say chest 38 waist 32)"
    : "🎙️ Voice Input"}
</button>
                <div className="grid grid-cols-2 gap-3">

                  {fields.map(field => (
                    <div
                      key={field}
                      className="flex flex-col bg-[#fffaf0] border border-[#ead7a1] rounded-xl px-3 py-2 shadow-sm"
                    >
                      <label className="text-[10px] text-[#8c7440] capitalize mb-1">
                        {field}
                      </label>

                      <input
                        value={c.measurements?.[field] || ""}
                        onChange={(e) =>
                          updateMeasurement(c._id, field, e.target.value)
                        }
                        className="w-full px-3 py-2 bg-[#fffaf0] text-black border border-[#e6d3a3] rounded outline-none caret-black placeholder:text-gray-500 focus:bg-[#fff3d6] focus:text-black"
                      />
                    </div>
                  ))}


                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 mt-4">

                  <button
                    onClick={() => saveMeasurements(c._id, c.measurements)}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#d4b25f] to-[#b8963f] text-white"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => deleteCustomer(c._id)}
                    className="flex-1 py-2 rounded-xl bg-[#f1e2b8] text-[#8c7440]"
                  >
                    Delete
                  </button>

                </div>

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}
