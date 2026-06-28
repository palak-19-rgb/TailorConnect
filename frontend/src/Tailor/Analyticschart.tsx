import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import API from "../api/api";

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const tailorId = localStorage.getItem("tailorId");
    if (!tailorId) return;

    API.get(`/TailorCustomer/analytics/${tailorId}`)
      .then((res: any) => {
        setAnalytics(res.data);
      })
      .catch((err: any) => {
        console.log("Analytics error:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8ec] via-[#f6ecd3] to-[#ead39a] px-8 py-10">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-[#b8963f] tracking-wide">
          Business Analytics 📈
        </h1>
        <p className="text-[#8c7440] mt-3 text-lg">
          Your atelier's performance at a glance ✨
        </p>
      </div>

      {!analytics && (
        <p className="text-center text-[#8c7440] mt-10">
          Loading analytics...
        </p>
      )}

      {analytics && (
        <>
          {/* SUMMARY CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">

            <div className="bg-white/40 backdrop-blur-xl border border-[#e3c98b] p-6 rounded-3xl shadow-lg text-center">
              <p className="text-xs uppercase tracking-wide text-[#8c7440]">Total Orders</p>
              <h3 className="text-3xl font-bold text-[#b8963f] mt-2">{analytics.totalOrders}</h3>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-[#e3c98b] p-6 rounded-3xl shadow-lg text-center">
              <p className="text-xs uppercase tracking-wide text-[#8c7440]">This Month</p>
              <h3 className="text-3xl font-bold text-[#b8963f] mt-2">{analytics.thisMonthCount}</h3>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-[#e3c98b] p-6 rounded-3xl shadow-lg text-center">
              <p className="text-xs uppercase tracking-wide text-[#8c7440]">Delivered</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">{analytics.delivered}</h3>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-[#e3c98b] p-6 rounded-3xl shadow-lg text-center">
              <p className="text-xs uppercase tracking-wide text-[#8c7440]">Top Outfit</p>
              <h3 className="text-xl font-bold text-[#b8963f] mt-2">{analytics.topOutfit}</h3>
            </div>

          </div>

          {/* PIE CHART */}
          {analytics.outfitBreakdown && Object.keys(analytics.outfitBreakdown).length > 0 && (
            <div className="bg-white/40 backdrop-blur-xl border border-[#e3c98b] p-6 rounded-3xl shadow-lg max-w-md mx-auto">
              <h3 className="text-center text-sm uppercase tracking-wide text-[#8c7440] mb-4">
                Outfit Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={Object.entries(analytics.outfitBreakdown).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {Object.keys(analytics.outfitBreakdown).map((_, index) => (
                      <Cell key={index} fill={["#b8963f", "#d4b25f", "#8c7440", "#e3c98b", "#a8842f"][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {(!analytics.outfitBreakdown || Object.keys(analytics.outfitBreakdown).length === 0) && (
            <p className="text-center text-[#8c7440] mt-10">
              No order data yet to show breakdown ✨
            </p>
          )}
        </>
      )}

    </div>
  );
}