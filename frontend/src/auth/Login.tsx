import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import API from "../api/api"; 
import { useNavigate } from "react-router-dom";


interface LoginData {
  email: string;
  pwd: string;
}

const INITIAL_STATE: LoginData = {
  email: "",
  pwd: "",
};

export default function Login({ setShowSignup, setShowLogin }: any) {
  const [form, setForm] = useState<LoginData>(INITIAL_STATE);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // ✅ AUTO REDIRECT IF ALREADY LOGGED IN
useEffect(() => {
  const role = localStorage.getItem("role");

  if (role && window.location.pathname === "/Login") {
    if (role === "Customer") navigate("/CustomerDash");
    else navigate("/TailorDash");
  }
}, []);





  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const email = form.email.trim();
  const pwd = form.pwd.trim();

  // ✅ EMAIL REGEX
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !pwd) {
    setError("All fields are required");
    return;
  }

  if (!emailRegex.test(email)) {
    setError("Enter a valid email address");
    return;
  }

  if (pwd.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  try {
    setLoading(true);

   const response = await API.post("/Login", { email, pwd });
   console.log("LOGIN:", response.data);
const data = response.data;

const role = data.role;

// ✅ dynamic API
const rolePath = role === "Customer" ? "customer" : "Tailor";
const fullUser = await API.get(`/${rolePath}/getByEmail/${email}`);
const user = fullUser.data;

// 🔥 PROFILE COMPLETE CHECK
const isProfileComplete = user.name && user.phone;

localStorage.setItem(
  "profileComplete",
  isProfileComplete ? "true" : "false"
);

localStorage.setItem("phone", fullUser.data.phone);
    localStorage.setItem("role", data.role);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("token", data.token);

  if (data.role === "Tailor") {
  const id = data.user?._id || data.user?.id || data._id;
  localStorage.setItem("tailorId", id);
}

    if (data.role === "Customer") {
      navigate("/CustomerDash");
    } else {
      navigate("/TailorDash");
    }

  } catch (err: any) {
    setError(err.response?.data?.msg || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};

const isFormValid =
  form.email.trim() &&
  form.pwd.trim() &&
  form.pwd.length >= 6;

return (
  <div className="text-[#5C3A21]">

    {/* TITLE */}
    <h2 className="text-3xl font-light text-center mb-1 tracking-wide">
      Welcome Back
    </h2>

    <p className="text-center text-sm text-[#8a6b4f] mb-8">
      Continue your tailoring journey
    </p>

    {/* FORM */}
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* EMAIL */}
      <div className="relative">
        <input
          type="email"
          name="email"
          placeholder=" "
          value={form.email}
          onChange={handleChange}
          className="peer w-full border-b border-[#C6A75E]/40 bg-transparent py-2 outline-none
          focus:border-[#C6A75E]"
        />
        <label className="absolute left-0 text-[#8a6b4f] transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm
        peer-focus:-top-3 peer-focus:text-xs peer-focus:text-[#C6A75E]
        -top-3 text-xs">
          Email
        </label>
      </div>

      {/* PASSWORD */}
      <div className="relative">
        <input
          type="password"
          name="pwd"
          placeholder=" "
          value={form.pwd}
          onChange={handleChange}
          className="peer w-full border-b border-[#C6A75E]/40 bg-transparent py-2 outline-none
          focus:border-[#C6A75E]"
        />
        <label className="absolute left-0 text-[#8a6b4f] transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm
        peer-focus:-top-3 peer-focus:text-xs peer-focus:text-[#C6A75E]
        -top-3 text-xs">
          Password
        </label>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* BUTTON 🔥 */}
    <button
  type="submit"
  disabled={loading || !isFormValid}
  className={`w-full py-3 rounded-full font-medium tracking-wide
  ${!isFormValid ? "bg-gray-300 cursor-not-allowed" : 
  "bg-gradient-to-r from-[#C6A75E] via-[#E6C57E] to-[#C6A75E] hover:scale-[1.04]"}
  text-[#3e2c1c] shadow-md transition-all duration-300`}
>
        {loading ? "Entering..." : "Enter Atelier"}
      </button>

    </form>

    {/* SIGNUP SWITCH */}
    <p className="text-sm mt-7 text-center text-[#6b4f2d]">
      New here?{" "}
      <span
       onClick={() => {
    setShowSignup(true);
    setShowLogin(false); // ⭐ IMPORTANT
  }}
        className="text-[#C6A75E] cursor-pointer hover:underline hover:text-[#b8954f] transition"
      >
        Create Account
      </span>
    </p>

  </div>
);}

