import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import myPhoto from "./assets/myphoto.jpg";

interface FormData {
  email: string;
  pwd: string;
  userType: "Customer" | "Tailor" | "";
}

interface SignupProps {
  switchToLogin?: () => void;
}

export default function Signup({ switchToLogin }: SignupProps) {
  const [form, setForm] = useState<FormData>({
    email: "",
    pwd: "",
    userType: "",
  });

  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validatePassword = (pwd: string) => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return strongPassword.test(pwd);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validatePassword(form.pwd)) {
      setError(
        "Password must be 8+ chars with Uppercase, Lowercase, Number & Special character"
      );
      return;
    }

    if (!form.userType) {
      setError("Please select a User Type");
      return;
    }

    try {
      const url = "http://localhost:2007/user/signup";
      const response = await axios.post(url, form);

      console.log("Backend response:", response.data);
      alert(`Signup Successful 🎉 as ${form.userType}`);

      setForm({ email: "", pwd: "", userType: "" });
      if (switchToLogin) switchToLogin();
    } catch (err: any) {
      setError(err.response?.data?.msg || "Something went wrong");
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#E6D7C5]">

      {/* LEFT IMAGE */}
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <img
          src={myPhoto}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover animate-slow-pan-zoom"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-extrabold text-[#FFEEDD] mb-2">
            Tailor Connect
          </h1>
          <p className="text-lg text-[#FFDAB3]">
            Bridging Customers & Tailors Seamlessly
          </p>
        </div>
      </div>

     {/* RIGHT SIDE */}
{/* RIGHT SIDE */}
<div className="relative w-full md:w-1/2 flex items-center justify-center p-8 bg-[#E6D7C5]">
 
  {/* SIGNUP CARD */}
  <div
    className={`relative w-full max-w-md p-8
      bg-[#FFF8EC]/95 backdrop-blur-md
      border-4 border-dashed border-[#C6A75E]
      rounded-2xl shadow-2xl
      transition-all duration-500
      hover:scale-[1.02]
      hover:shadow-[0_0_25px_rgba(198,167,94,0.5)]
      transform ${
        animate
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0"
      }
    `}
  >

    <h2 className="text-3xl font-bold text-center mb-6
      bg-gradient-to-r from-[#C6A75E] via-[#E6C57E] to-[#C6A75E]
      bg-clip-text text-transparent">
      Create Account
    </h2>

    <form onSubmit={handleSubmit} className="space-y-5">

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full bg-[#FFF8EC]/60
        border-b-2 border-[#E6C57E]
        px-3 py-2 rounded
        focus:outline-none
        focus:border-[#C6A75E]
        focus:ring-2 focus:ring-[#E6C57E]/50
        text-[#5C3A21]"
      />

      <input
        type="password"
        name="pwd"
        placeholder="Password"
        value={form.pwd}
        onChange={handleChange}
        required
        className="w-full bg-[#FFF8EC]/60
        border-b-2 border-[#E6C57E]
        px-3 py-2 rounded
        focus:outline-none
        focus:border-[#C6A75E]
        focus:ring-2 focus:ring-[#E6C57E]/50
        text-[#5C3A21]"
      />

      <select
        name="userType"
        value={form.userType}
        onChange={handleChange}
        required
        className="w-full bg-[#FFF8EC]/60
        border-b-2 border-[#E6C57E]
        px-3 py-2 rounded
        focus:outline-none
        focus:border-[#C6A75E]
        focus:ring-2 focus:ring-[#E6C57E]/50
        text-[#5C3A21]"
      >
        <option value="" disabled>
          Select User Type
        </option>
        <option value="Customer">Customer</option>
        <option value="Tailor">Tailor</option>
      </select>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        className="w-full py-2 rounded-lg font-semibold
        bg-gradient-to-r from-[#C6A75E] to-[#E6C57E]
        text-[#4A2E15]
        transition-all duration-300
        hover:from-[#B8954F] hover:to-[#D9B76C]
        hover:shadow-[0_0_20px_rgba(198,167,94,0.6)]
        hover:scale-105"
      >
        Sign Up
      </button>

    </form>

  </div>

  {/* Floating Animation Keyframe */}
  <style>
    {`
      @keyframes float {
        0% { transform: translateY(0); }
        100% { transform: translateY(800px); }
      }
    `}
  </style>

</div>
      </div>
 
  );
}