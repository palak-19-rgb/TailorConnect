///testing contibution
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import API from "../api/api";


interface CustomerProfile {
  name: string;
  gender?: "Male" | "Female" | "Other";
  dob?: string;
  phone: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  profilePic?: File | null;
}

interface Errors {
  name?: string;
  dob?: string;
  phone?: string;
  email?: string;
  pincode?: string;
  profilePic?: string;
}

const CustomerProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<CustomerProfile>({
    name: "",
    gender: undefined,
    dob: "",
    phone: "",
    email: "",
    address: {},
    profilePic: null,
  });

  const [errors, setErrors] = useState<Errors>({});
 const [isEditing, setIsEditing] = useState(false);
 const [isNewUser, setIsNewUser] = useState(false);


  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!profile.name.trim()) newErrors.name = "Name is required";
    else if (profile.name.trim().length < 3)
      newErrors.name = "Minimum 3 characters";

    if (profile.dob) {
      const today = new Date();
      const selected = new Date(profile.dob);
      if (selected > today) newErrors.dob = "Future date not allowed";
    }

    const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
    if (!profile.phone) newErrors.phone = "Phone is required";
    else if (!phoneRegex.test(profile.phone))
      newErrors.phone = "Invalid Indian phone number";

    if (profile.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email))
        newErrors.email = "Invalid email format";
    }

    if (profile.address?.pincode && !/^\d{6}$/.test(profile.address.pincode))
      newErrors.pincode = "Pincode must be 6 digits";

    if (profile.profilePic) {
      if (!profile.profilePic.type.startsWith("image/"))
        newErrors.profilePic = "Only image files allowed";
      if (profile.profilePic.size > 2 * 1024 * 1024)
        newErrors.profilePic = "Image must be < 2MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile({ ...profile, profilePic: e.target.files[0] });
    }
  };

  const handlePincodeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const pincode = e.target.value;
    setProfile({
      ...profile,
      address: { ...profile.address, pincode },
    });

    if (pincode.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await res.json();

        if (data[0].Status === "Success") {
          const po = data[0].PostOffice[0];
          setProfile((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              pincode,
              city: po.District,
              state: po.State,
            },
          }));
        }
      } catch (err) {
        console.error("Pincode fetch error:", err);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("gender", profile.gender || "");
      formData.append("dob", profile.dob || "");
      formData.append("phone", profile.phone);
     formData.append("email", localStorage.getItem("email") || "");
      formData.append("street", profile.address?.street || "");
      formData.append("city", profile.address?.city || "");
      formData.append("state", profile.address?.state || "");
      formData.append("pincode", profile.address?.pincode || "");
      formData.append("country", profile.address?.country || "");

      if (profile.profilePic)
  formData.append("profilepic", profile.profilePic); 

    await API.post("/customer/CustomerDetails", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
const savedEmail = localStorage.getItem("email") || "";
if (savedEmail) {
  const res = await API.get(`/customer/getByEmail/${savedEmail}`);
  const data = res.data;
  setProfile(prev => ({ 
    ...prev, 
    ...data,
    address: data.address || prev.address
  }));
}
setIsNewUser(false);
setIsEditing(false);
alert("Profile saved successfully!");
window.location.reload();
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error saving profile");
    }
  };

useEffect(() => {
  const email = localStorage.getItem("email");
  if (!email) return;

API.get(`/customer/getByEmail/${email}`)
    .then(res => res.data)
    .then(data => {
      console.log("API:", data);

      if (data && data.email && data.name) {
        // ✅ EXISTING USER
      setProfile(prev => ({
  ...prev,
  ...data,
  address: data.address || prev.address
}));

        setIsEditing(false);
        setIsNewUser(false);
      } else {
        // 🆕 NEW USER
        setIsEditing(true);
        setIsNewUser(true);
      }
    })
    .catch(err => console.log(err));
}, []);



// AUTO LOGOUT - 10 min idle
useEffect(() => {
  let timer: ReturnType<typeof setTimeout>;

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      localStorage.clear();
      window.location.href = "/";
    }, 10 * 60 * 1000); // 10 minutes
  };

  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  window.addEventListener("click", resetTimer);
  resetTimer();

  return () => {
    clearTimeout(timer);
    window.removeEventListener("mousemove", resetTimer);
    window.removeEventListener("keydown", resetTimer);
    window.removeEventListener("click", resetTimer);
  };
}, []);

  return (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-serif bg-[#f8f1df]">

    {/* BG */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#fdf6e8] via-[#f3e2b8] to-[#e0b96a]"></div>

    {/* soft glow (reduced harshness) */}
    <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-[#ffd700] opacity-10 blur-[180px] rounded-full"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#b8860b] opacity-10 blur-[160px] rounded-full"></div>

    {/* sweep effect (UNCHANGED) */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -left-full top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[sweep_10s_linear_infinite]"></div>
    </div>

    {/* texture */}
    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,_#b8860b_1px,_transparent_1px)] bg-[size:40px_40px]"></div>

    {/* CARD */}
    <div className="relative z-10 w-full max-w-4xl p-10 rounded-3xl bg-white/70 backdrop-blur-2xl border border-[#e7c977]/60 shadow-[0_60px_150px_rgba(180,130,40,0.35)] hover:shadow-[0_80px_200px_rgba(180,130,40,0.45)] transition-all duration-700">

      {/* HEADING */}
      <h2 className="relative text-4xl text-center text-[#b8860b] tracking-wide mb-3 overflow-hidden">
        <span className="relative z-10">Royal Client Atelier</span>
        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4b25f] to-transparent animate-pulse"></span>
      </h2>

      <p className="text-center text-sm tracking-[4px] uppercase text-[#b8963f] mb-8">
        Bespoke Profile Registration
      </p>

      <form onSubmit={handleSubmit} className="relative space-y-8">

        {/* PHOTO + NAME */}
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-[#e7c977] pb-8">

          <label className="cursor-pointer relative">
            <div className="w-40 h-40 rounded-full border-4 border-[#b8860b] bg-[#fff8e6] flex items-center justify-center overflow-hidden shadow-[0_10px_40px_rgba(184,134,11,0.3)] hover:scale-105 transition-all duration-500 relative">

              <div className="absolute inset-2 rounded-full border border-[#d4b25f] opacity-60 pointer-events-none" />

              {profile.profilePic ? (
                <img
                  src={URL.createObjectURL(profile.profilePic)}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#b8860b] text-xs tracking-[3px] uppercase text-center px-4">
                  Upload Photo
                </span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
               disabled={!isEditing}
              className="hidden"
            />
          </label>

          <div className="flex-1 w-full">
            <input
              type="text"
               disabled={!isEditing}
              placeholder="Full Name"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full bg-white border border-[#e7c977] px-6 py-4 rounded-lg text-[#5a4630] text-lg focus:outline-none focus:border-[#b8963f] shadow-sm"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-2">{errors.name}</p>
            )}
          </div>

        </div>

        {/* Gender + DOB */}
        <div className="grid md:grid-cols-2 gap-6">
          <select
            value={profile.gender || ""}
            onChange={(e) =>
              setProfile({ ...profile, gender: e.target.value as any })
            }
            className="bg-white border border-[#e7c977] px-4 py-3 rounded-lg text-[#5a4630]"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <div>
            <input
              type="date"
              value={profile.dob || ""}
               disabled={!isEditing}
              onChange={(e) =>
                setProfile({ ...profile, dob: e.target.value })
              }
              className="w-full bg-white border border-[#e7c977] px-4 py-3 rounded-lg text-[#5a4630]"
            />
            {errors.dob && (
              <p className="text-red-600 text-sm mt-1">{errors.dob}</p>
            )}
          </div>
        </div>

        {/* Phone + Email */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={profile.phone}
               disabled={!isEditing}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full bg-white border border-[#e7c977] px-4 py-3 rounded-lg text-[#5a4630]"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={profile.email || ""}
               disabled={!isEditing}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full bg-white border border-[#e7c977] px-4 py-3 rounded-lg text-[#5a4630]"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* ADDRESS */}
        <div className="p-6 rounded-xl bg-[#fff8e6] border border-[#e9c987]">
          <h3 className="text-sm uppercase tracking-[3px] text-[#b8860b] mb-4">
            Residence Details
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Street Address"
              value={profile.address?.street || ""}
               disabled={!isEditing}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: { ...profile.address, street: e.target.value },
                })
              }
              className="bg-white border border-[#e7c977] px-4 py-3 rounded-lg text-[#5a4630]"
            />

            <input
              type="text"
              placeholder="Pincode"
              value={profile.address?.pincode || ""}
               disabled={!isEditing}
              onChange={handlePincodeChange}
              className="bg-white border border-[#e7c977] px-4 py-3 rounded-lg text-[#5a4630]"
            />

            {errors.pincode && (
              <p className="text-red-600 text-sm md:col-span-2">
                {errors.pincode}
              </p>
            )}

            <input
              type="text"
              placeholder="City"
              value={profile.address?.city || ""}
               disabled={!isEditing}
              readOnly
              className="bg-[#f5ede3] border border-[#e7c977] px-4 py-3 rounded-lg text-[#5a4630]"
            />

            <input
              type="text"
              placeholder="State"
              value={profile.address?.state || ""}
               disabled={!isEditing}
              readOnly
              className="bg-[#f5ede3] border border-[#e7c977] px-4 py-3 rounded-lg text-[#5a4630]"
            />

            <input
              type="text"
              placeholder="Country"
              value={profile.address?.country || ""}
               disabled={!isEditing}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: { ...profile.address, country: e.target.value },
                })
              }
              className="bg-white border border-[#e7c977] px-4 py-3 rounded-lg text-[#5a4630]"
            />
          </div>
        </div>

        {/* BUTTON LOGIC */}

{isNewUser ? (
  // 🆕 NEW USER → DIRECT SAVE
  <button
    type="submit"
    className="w-full py-4 rounded-lg bg-gradient-to-r from-[#b8963f] via-[#d4b25f] to-[#b8963f] text-white"
  >
    SAVE PROFILE
  </button>
) : !isEditing ? (
  // 👤 EXISTING USER → UPDATE BUTTON
 <button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  }}
  className="w-full py-4 rounded-lg border border-[#b8963f] text-[#b8963f]"
>
  UPDATE PROFILE
</button>
) : (
  // ✏️ EDIT MODE → SAVE
  <button
    type="submit"
    className="w-full py-4 rounded-lg bg-gradient-to-r from-[#b8963f] via-[#d4b25f] to-[#b8963f] text-white"
  >
    SAVE PROFILE
  </button>
)}

      </form>
    </div>
  </div>
);
};

export default CustomerProfileForm;