import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 100,
  duration: "30s",
};

const BASE = "http://localhost:1000";

// Existing emails from DB
const CUSTOMER_EMAIL = "customer@gmail.com";
const TAILOR_EMAIL = "tailor@gmail.com";

export default function () {

  // 1. Tailor Profile
  const profileRes = http.get(
    `${BASE}/Tailor/getByEmail/${TAILOR_EMAIL}`
  );

  check(profileRes, {
    "Tailor Profile 200": (r) => r.status === 200,
  });

  // 2. Customer Orders
  const orderRes = http.get(
    `${BASE}/TailorCustomer/customer/${CUSTOMER_EMAIL}`
  );

  check(orderRes, {
    "Orders 200": (r) =>
      r.status === 200 || r.status === 404,
  });

  // 3. Tailors List
  const tailorListRes = http.get(
    `${BASE}/Tailor/tailors?city=Lucknow`
  );

  check(tailorListRes, {
    "Tailor List 200": (r) => r.status === 200,
  });

  // 4. Login (Wrong Password -> Rate Limiter)
  const loginRes = http.post(
    `${BASE}/Login`,
    JSON.stringify({
      email: CUSTOMER_EMAIL,
      pwd: "WrongPassword123",
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  check(loginRes, {
    "Login returns valid status": (r) =>
      [200, 401, 429].includes(r.status),
  });

  // 5. Protected Route (No JWT)
  const noToken = http.get(
    `${BASE}/TailorCustomer/someFakeTailorId`
  );

  check(noToken, {
    "No Token Unauthorized": (r) =>
      r.status === 401 || r.status === 403,
  });

  // 6. Protected Route (Fake JWT)
  const fakeToken = http.get(
    `${BASE}/TailorCustomer/someFakeTailorId`,
    {
      headers: {
        Authorization: "Bearer faketoken123",
      },
    }
  );

  check(fakeToken, {
    "Fake Token Unauthorized": (r) =>
      r.status === 401 || r.status === 403,
  });

  // 7. Chatbot
  const chatbot = http.post(
    `${BASE}/chatbot/message`,
    JSON.stringify({
      message: "Suggest a tailor in Lucknow",
      sessionId: `session_${__VU}`,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  check(chatbot, {
    "Chatbot 200": (r) => r.status === 200,
  });

  // 8. Reviews
  const reviewRes = http.get(
    `${BASE}/Tailor/reviews/8090974434`
  );

  check(reviewRes, {
    "Reviews endpoint": (r) =>
      r.status === 200 || r.status === 404,
  });

  // 9. Messages
  const msgRes = http.get(
    `${BASE}/messages/testroom`
  );

  check(msgRes, {
    "Messages endpoint": (r) =>
      r.status === 200 || r.status === 404,
  });

  sleep(1);
}