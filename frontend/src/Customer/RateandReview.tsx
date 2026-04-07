import React, { useState, useEffect } from "react";
import axios from "axios";

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  review: string;
}

const RateAndReview: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [tailorName, setTailorName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<number>(0);
  const [animatedAverage, setAnimatedAverage] = useState<number>(0);

  const API_BASE = "https://tailorconnect-backend.onrender.com";

  /* ⭐ Animate Average */
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = average / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= average) {
        setAnimatedAverage(average);
        clearInterval(counter);
      } else {
        setAnimatedAverage(Number(start.toFixed(1)));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [average]);

  /* 🔥 Fetch Tailor Name */
  const fetchTailor = async (mobileNumber: string) => {
    try {
      const res = await axios.get(`${API_BASE}/Tailor/tailorprofile/${mobileNumber}`);
      setTailorName(res.data.name);
    } catch {
      setTailorName("");
    }
  };

  /* 🔥 Fetch Reviews */
  const fetchReviews = async (mobileNumber: string) => {
    const res = await axios.get(`${API_BASE}/Tailor/reviews/${mobileNumber}`);
    const data = res.data;
    setReviews(data);

    if (data.length > 0) {
      const avg =
        data.reduce((sum: number, r: Review) => sum + r.rating, 0) /
        data.length;
      setAverage(Number(avg.toFixed(1)));
    } else {
      setAverage(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!mobile || !rating || !reviewText) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await axios.post(`${API_BASE}/Tailor/addReview`, {
      mobile,
      rating,
      review: reviewText,
    });

    if (res.data.status) {
      alert("Review Added Successfully ⭐");
    }

    setReviewText("");
    setRating(0);
    fetchReviews(mobile);

  } catch (err) {
    alert("Error submitting review");
    console.log(err);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 golden-bg relative overflow-hidden">

      {/* ✨ Gold Grain Texture */}
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-md rounded-3xl border border-[#e6c977]/40 shadow-[0_30px_80px_rgba(180,140,60,0.25)] p-14 fade-in">

        {/* 👑 Luxury Serif Heading */}
        <h2 className="text-4xl text-center mb-12 text-[#6b552a] font-serif tracking-wide">
          Tailor Reviews
        </h2>

        {/* ⭐ Average */}
        {average > 0 && (
          <div className="text-center mb-10">
            <div className="text-5xl font-bold text-[#6b552a]">
              {animatedAverage}
              <span className="text-[#c6a75e] ml-1">★</span>
            </div>
          </div>
        )}

        {/* 📝 Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-14">

          <input
            type="text"
            placeholder="Tailor Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            onBlur={() => {
              if (mobile) {
                fetchTailor(mobile);
                fetchReviews(mobile);
              }
            }}
            className="w-full border border-[#e7d9bf] bg-[#fffdf8] px-6 py-4 rounded-xl text-[#5a4630] focus:ring-2 focus:ring-[#c6a75e] outline-none"
          />

          {/* 💡 Tailor Name Light Box */}
          {tailorName && (
            <div className="bg-[#f8f1dc] border border-[#e6c977] rounded-xl px-6 py-3 text-[#6b552a] text-center shadow-sm">
              Tailor: <span className="font-semibold">{tailorName}</span>
            </div>
          )}

          {/* ⭐ Stars */}
          <div className="flex justify-center gap-3">
            {[...Array(5)].map((_, index) => {
              const current = index + 1;
              return (
                <span
                  key={index}
                  className={`text-4xl cursor-pointer transition-all duration-300 ${
                    current <= (hover || rating)
                      ? "text-[#c6a75e] scale-110"
                      : "text-[#e7d9bf]"
                  }`}
                  onClick={() => setRating(current)}
                  onMouseEnter={() => setHover(current)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              );
            })}
          </div>

          <textarea
            placeholder="Share your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="w-full border border-[#e7d9bf] bg-[#fffdf8] px-6 py-4 rounded-xl text-[#5a4630] focus:ring-2 focus:ring-[#c6a75e] outline-none resize-none"
          />

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#c6a75e] to-[#b8954c] text-white font-semibold hover:scale-[1.02] transition duration-300 shadow-md"
          >
            Submit Review
          </button>
        </form>

        {/* 🏆 Review Cards */}
        <div className="space-y-6">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-[#fffdf8] border border-[#e7d9bf] rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-[#6b552a]">
                  {r.customerName || "Customer"}
                </span>
                <span className="text-[#c6a75e]">
                  {"★".repeat(r.rating)}
                </span>
              </div>
              <p className="text-[#7a6232] text-sm leading-relaxed">
                {r.review}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* 🎨 Styles */}
      <style>
        {`
          .golden-bg {
            background: linear-gradient(
              135deg,
              #f7e6c2 0%,
              #f2d594 50%,
              #e8c36b 100%
            );
          }

          .fade-in {
            animation: fadeIn 0.8s ease forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Subtle Grain Texture */
          .grain-overlay {
            background-image: url("https://www.transparenttextures.com/patterns/asfalt-light.png");
            opacity: 0.08;
          }
        `}
      </style>
    </div>
  );
};

export default RateAndReview;