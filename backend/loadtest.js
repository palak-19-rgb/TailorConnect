import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 100,
  duration: "30s",
};

const EMAIL = "chughp234@gmail.com";
const BASE = "http://localhost:1000";

export default function () {

  // ✅ 1. GET TAILOR PROFILE (public)
  const profileRes = http.get(`${BASE}/Tailor/getByEmail/${EMAIL}`);
  check(profileRes, {
    "Tailor Profile 200": (r) => r.status === 200,
  });

  // ✅ 2. GET ORDERS (public)
  const orderRes = http.get(`${BASE}/TailorCustomer/customer/${EMAIL}`);
  check(orderRes, {
    "Orders 200": (r) => r.status === 200,
  });

  // ✅ 3. GET TAILORS LIST (public)
  const tailorsRes = http.get(`${BASE}/Tailor/tailors?city=Lucknow`);
  check(tailorsRes, {
    "Tailors List 200": (r) => r.status === 200,
  });

  // ✅ 4. RATE LIMITER TEST — Login pe rapid fire
  const loginRes = http.post(
    `${BASE}/Login`,
    JSON.stringify({ email: "test@gmail.com", pwd: "WrongPass1" }),
    { headers: { "Content-Type": "application/json" } }
  );
  check(loginRes, {
    "Login Rate Limit OK (200/401/429)": (r) =>
      r.status === 200 || r.status === 401 || r.status === 429,
    "Rate Limiter Triggered": (r) => r.status === 429,
  });

  // ✅ 5. JWT TEST — protected route bina token ke
  const noTokenRes = http.get(`${BASE}/TailorCustomer/someFakeTailorId`);
  check(noTokenRes, {
    "No Token = 401": (r) => r.status === 401,
  });

  // ✅ 6. JWT TEST — protected route galat token se
  const fakeTokenRes = http.get(`${BASE}/TailorCustomer/someFakeTailorId`, {
    headers: { Authorization: "Bearer faketoken123" },
  });
  check(fakeTokenRes, {
    "Fake Token = 401": (r) => r.status === 401,
  });

  // ✅ 7. CHATBOT TEST (public)
  const chatRes = http.post(
    `${BASE}/chatbot/message`,
    JSON.stringify({
      message: "suggest a tailor in Lucknow",
      sessionId: `session_${__VU}`,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  check(chatRes, {
    "Chatbot 200": (r) => r.status === 200,
  });

  // ✅ 8. GET REVIEWS (public)
  const reviewRes = http.get(`${BASE}/Tailor/reviews/8090974434`);
  check(reviewRes, {
    "Reviews 200": (r) => r.status === 200,
  });

  // ✅ 9. SOCKET MESSAGES (public)
  const msgRes = http.get(`${BASE}/messages/testroom`);
  check(msgRes, {
    "Messages 200": (r) => r.status === 200,
  });

  sleep(1);
}