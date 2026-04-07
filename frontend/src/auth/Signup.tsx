import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  pwd: string;
  userType: "Customer" | "Tailor" | "";
}

export default function Signup({ setShowLogin, setShowSignup }: any) {
  const [form, setForm] = useState<FormData>({
    email: "",
    pwd: "",
    userType: "",
  });

  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const email = form.email.trim();
    const pwd = form.pwd.trim();
    const userType = form.userType;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !pwd || !userType) {
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

    // 🔐 Strong password (optional but 🔥)
    const strongPwd = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!strongPwd.test(pwd)) {
      setError("Password must contain 1 uppercase & 1 number");
      return;
    }

    try {
     const BASE_URL = "https://tailorconnect-backend.onrender.com";

const url =
  userType === "Customer"
    ? `${BASE_URL}/Customer/Signup`
    : `${BASE_URL}/Tailor/Signup`;

      await axios.post(url, {
        email,
        pwd,
        UserType: userType
      });

      alert("Signup Successful 🎉");

      setShowSignup(false);
      setShowLogin(true);

    } catch (err: any) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  const isValid =
    form.email &&
    form.pwd.length >= 6 &&
    form.userType;

  return (
    <div className="text-[#5C3A21]">

      <h2 className="text-3xl font-light text-center mb-1 tracking-wide">
        Create Account
      </h2>

      <p className="text-center text-sm text-[#8a6b4f] mb-8">
        Begin your tailoring journey
      </p>

      <form onSubmit={handleSubmit} className="space-y-7">

        {/* EMAIL */}
        <div className="relative">
          <input
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
            name="pwd"
            type={showPwd ? "text" : "password"}
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

        {/* USER TYPE */}
        <div className="relative">
          <select
            name="userType"
            value={form.userType}
            onChange={handleChange}
            className="w-full border-b border-[#C6A75E]/40 bg-transparent py-2 outline-none
            text-[#6b4f2d] focus:border-[#C6A75E]"
          >
            <option value="">Select User Type</option>
            <option value="Customer">Customer</option>
            <option value="Tailor">Tailor</option>
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3 rounded-full font-medium tracking-wide
  ${!isValid ? "bg-gray-300 cursor-not-allowed" :
              "bg-gradient-to-r from-[#C6A75E] via-[#E6C57E] to-[#C6A75E] hover:scale-[1.04]"}
  text-[#3e2c1c] shadow-md transition-all duration-300`}
        >
          Create Account
        </button>

      </form>

      {/* 🔥 ADD THIS (IMPORTANT) */}
      <p className="text-sm mt-6 text-center text-[#6b4f2d]">
        Already have an account?{" "}
        <span
          onClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          className="text-[#C6A75E] cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>

    </div>
  );
}