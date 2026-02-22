import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import myPhoto from "./assets/myphoto.jpg";

interface LoginData {
  email: string;
  pwd: string;
}

const INITIAL_STATE: LoginData = {
  email: "",
  pwd: "",
};

export default function Login() {
  const [form, setForm] = useState<LoginData>(INITIAL_STATE);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = form.email.trim();
    const pwd = form.pwd.trim();

    if (!email || !pwd) {
      setError("Email and Password are required");
      return;
    }

    try {
      const url = "http://localhost:2007/user/Login";
      const response = await axios.post(url, { email, pwd });
      console.log("Backend response:", response.data);
      alert("Login Successful 🎉");
    } catch (err: any) {
      setError(err.response?.data?.msg || "Email or Password is incorrect");
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

      {/* RIGHT SIDE WITH FABRIC TEXTURE */}
      <div
        className="relative w-full md:w-1/2 flex items-center justify-center p-8 overflow-hidden
        bg-[#E6D7C5]
        before:absolute before:inset-0
        before:bg-[radial-gradient(circle_at_1px_1px,rgba(182,145,91,0.12)_1px,transparent_1px)]
        before:bg-[size:22px_22px]
        before:opacity-40
        before:pointer-events-none"
      >

        {/* Soft Fabric Gradient Overlay */}
        <div className="absolute inset-0
          bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,transparent_40%,rgba(198,167,94,0.08)_100%)]
          pointer-events-none">
        </div>

        {/* LOGIN CARD */}
        <div
          className="relative w-full max-w-md p-8
          bg-[#FFF8EC]/95 backdrop-blur-md
          border-4 border-dashed border-[#C6A75E]
          rounded-2xl shadow-2xl
          transition-all duration-300
          hover:scale-[1.02]
          hover:shadow-[0_0_25px_rgba(198,167,94,0.5)]"
        >

          <h2
            className="text-3xl font-bold text-center mb-6
            bg-gradient-to-r from-[#C6A75E] via-[#E6C57E] to-[#C6A75E]
            bg-clip-text text-transparent"
          >
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#FFF8EC]/60
              border-b-2 border-[#E6C57E]
              px-3 py-2 rounded
              focus:outline-none
              focus:border-[#C6A75E]
              focus:ring-2 focus:ring-[#E6C57E]/50
              text-[#5C3A21]
              placeholder-[#C6A75E]/70
              transition-all duration-300"
            />

            <input
              type="password"
              name="pwd"
              placeholder="Password"
              value={form.pwd}
              onChange={handleChange}
              className="w-full bg-[#FFF8EC]/60
              border-b-2 border-[#E6C57E]
              px-3 py-2 rounded
              focus:outline-none
              focus:border-[#C6A75E]
              focus:ring-2 focus:ring-[#E6C57E]/50
              text-[#5C3A21]
              placeholder-[#C6A75E]/70
              transition-all duration-300"
            />

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
              hover:scale-105
              active:scale-95"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-[#5C3A21]">
            Don’t have an account?{" "}
            <span className="text-[#C6A75E] font-medium cursor-pointer hover:text-[#B8954F] hover:underline transition">
              Sign Up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}