import { useEffect, useState } from "react";
import { motion } from "framer-motion";


type Tailor = {
    _id: string;
    ownerName?: string;
    name?: string;
    city?: string;
    rating?: number;
    phone?: string;
    image?: string;
    shopAddress?: {
        city?: string;
    };
};
export default function SavedTailors() {
    const [tailors, setTailors] = useState<Tailor[]>([]);
    const [selectedTailor, setSelectedTailor] = useState<Tailor | null>(null);

    useEffect(() => {
        fetchSavedTailors();
    }, []);

    const fetchSavedTailors = async () => {
        try {
          const email = localStorage.getItem("email");
if (!email) return;

const res = await fetch(
  `https://tailorconnect-backend.onrender.com/customer/saved/${email}`
);

            const data = await res.json();

           setTailors(
  Array.isArray(data)
    ? data
    : Array.isArray(data.savedTailors)
    ? data.savedTailors
    : []
);
        } catch (err) {
            console.log("Fetch error:", err);
            setTailors([]);
        }
    };

    const removeTailor = async (tailorId: string) => {
        if (!tailorId) return;

        const confirmDelete = window.confirm("Remove this tailor?");
        if (!confirmDelete) return;

        try {
           const email = localStorage.getItem("email");
if (!email) return;

await fetch("https://tailorconnect-backend.onrender.com/customer/remove-tailor", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, tailorId }),
});

            setTailors((prev) => prev.filter((t) => t._id !== tailorId));
        } catch (err) {
            console.log(err);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fdf8ec] via-[#f6ecd3] to-[#ead39a] px-8 py-10">

            {/* HEADER */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-serif font-bold text-[#b8963f] tracking-wide">
                    Saved Tailors
                </h1>
                <p className="text-[#8c7440] mt-3 text-lg">
                    Your favorite designers 💛
                </p>
            </div>


            {tailors.length === 0 && (
                <p className="text-center text-[#8c7440] mt-10 col-span-full">
                    No saved tailors yet 💛
                </p>
            )}


            {/* GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tailors.map((t) => (
                    <motion.div
                        key={t._id}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/80 p-6 rounded-3xl shadow-xl border border-[#e3c98b]"
                    >



                        {/* IMAGE */}
                        <img
                            src={t.image || "/default-tailor.jpg"}
                            onError={(e) => (e.currentTarget.src = "/default-tailor.jpg")}
                            className="w-full h-40 object-cover rounded-xl mb-4"
                        />
                        <h2 className="text-xl text-[#b8963f] font-semibold">
                            {t.ownerName || t.name || "Unnamed Tailor"}
                        </h2>

                        <p className="text-sm text-gray-600 mt-1">
                            📍 {t.shopAddress?.city || t.city || "N/A"}
                        </p>

                        <p className="text-sm text-gray-600">
                            ⭐ {t?.rating ?? "No rating"}
                        </p>

                        {/* BUTTONS */}
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setSelectedTailor(t)}
                                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#d4b25f] to-[#b8963f] text-white"
                            >
                                View Profile
                            </button>

                            <button
                                onClick={() => removeTailor(t._id)}
                                className="px-3 py-2 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition"
                            >
                                ❌
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ✅ MODAL (MAP KE BAHAR) */}
            {selectedTailor && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="relative bg-gradient-to-br from-white via-[#fffaf0] to-[#f7ecd3] border border-[#e3c98b] rounded-3xl p-8 w-[380px] shadow-2xl">

                        {/* ✖ CLOSE (pretty) */}
                        <button
                            onClick={() => setSelectedTailor(null)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f3e3b3] text-[#b8963f] hover:bg-[#e8d28a] transition shadow"
                        >
                            ✕
                        </button>

                        {/* TOP SECTION */}
                        <div className="flex items-center gap-4">

                            {/* IMAGE */}
                            <img
                                src={selectedTailor.image || "/default-tailor.jpg"}
                                className="w-20 h-20 rounded-full object-cover border-4 border-[#e3c98b] shadow-md"
                            />

                            {/* NAME + RATING */}
                            <div>
                                <h2 className="text-xl font-bold text-[#b8963f]">
                                    {selectedTailor.ownerName || selectedTailor.name}
                                </h2>

                                <p className="text-sm text-[#8c7440]">
                                    ⭐ {selectedTailor?.rating ?? "No Rating"}
                                </p>
                            </div>

                        </div>

                        {/* LINE */}
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#e3c98b] to-transparent my-5"></div>

                        {/* DETAILS */}
                        <div className="space-y-3 text-sm text-[#5c4b2c]">

                            <p className="flex justify-between">
                                <span className="font-medium">📍 City</span>
                                <span>{selectedTailor?.shopAddress?.city || selectedTailor?.city}</span>
                            </p>

                            <p className="flex justify-between">
                                <span className="font-medium">📞 Phone</span>
                                <span>{selectedTailor.phone}</span>
                            </p>

                            <p className="flex justify-between">
                                <span className="font-medium">⭐ Rating</span>
                                <span>{selectedTailor?.rating ?? "No Rating"}</span>
                            </p>

                        </div>

                        {/* CALL BUTTON */}
                        <button
                            onClick={() => {
                                if (!selectedTailor?.phone) {
                                    alert("Phone number not available");
                                    return;
                                }
                                window.location.href = `tel:${selectedTailor.phone}`;
                            }}
                            className="mt-6 w-full py-2 rounded-xl bg-gradient-to-r from-[#d4b25f] to-[#b8963f] text-white shadow hover:scale-105 transition"
                        >
                            Call Now
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}