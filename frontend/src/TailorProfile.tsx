import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
} from "react";

interface TailorProfileData {
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  gender: string;
  gst: string;
  experience: string;
  workType: string;
  personalAddress: string;

  landmark: string;
  floorNumber: string;
  area: string;
  shopTimings: string;
  shopAddress: string;
  city: string;
  state: string;
  pincode: string;

  socialLink: string;
  otherInfo: string;
  aadhaarNumber: string;
  profilePhoto: File | null;
  aadhaarPhoto: File | null;
}

const TailorProfile: React.FC = () => {
  const [step, setStep] = useState(1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [profile, setProfile] = useState<TailorProfileData>({
    shopName: "",
    ownerName: "",
    phone: "",
    email: "",
    gender: "",
    gst: "",
    experience: "",
    workType: "",
    personalAddress: "",
    landmark: "",
    floorNumber: "",
    area: "",
    shopTimings: "",
    shopAddress: "",
    city: "",
    state: "",
    pincode: "",
    socialLink: "",
    otherInfo: "",
    aadhaarNumber: "",
    profilePhoto: null,
    aadhaarPhoto: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [loadingLocation, setLoadingLocation] = useState(false);


  const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setProfile((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev: any) => ({
    ...prev,
    [name]: "",
  }));
};

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];

    setProfile((prev) => ({
      ...prev,
      [e.target.name]: file,
    }));

    // Profile photo preview
    if (e.target.name === "profilePhoto") {
      setPreview(URL.createObjectURL(file));
    }

    // 🚀 Aadhaar OCR Trigger
    if (e.target.name === "aadhaarPhoto") {
      const formData = new FormData();
      formData.append("aadhaarPhoto", file);

      try {
        const res = await fetch(
          "http://localhost:2007/Tailor/extract-aadhaar",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (data.status) {
          setProfile((prev) => ({
            ...prev,
            aadhaarNumber: data.aadhaarNumber,
            gender: data.gender,
          }));
        } else {
          alert("Could not extract Aadhaar details");
        }
      } catch (err) {
        console.log("OCR error:", err);
      }
    }
  }
};

  /* ---------------- PINCODE DEBOUNCE ---------------- */
  useEffect(() => {
    if (!/^[0-9]{6}$/.test(profile.pincode)) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoadingLocation(true);
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${profile.pincode}`
        );
        const data = await res.json();

        if (data[0].Status === "Success") {
          const post = data[0].PostOffice[0];

          setProfile((prev) => ({
            ...prev,
            city: post.District,
            state: post.State,
          }));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingLocation(false);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [profile.pincode]);

  /* ---------------- STEP VALIDATION ---------------- */
  const validateStep = () => {
  let newErrors: any = {};

  if (step === 1) {
    if (!profile.shopName.trim()) newErrors.shopName = "Required";
    if (!profile.ownerName.trim()) newErrors.ownerName = "Required";

    if (!/^[0-9]{10}$/.test(profile.phone))
      newErrors.phone = "Enter valid 10 digit phone number";

    if (!/^\S+@\S+\.\S+$/.test(profile.email))
      newErrors.email = "Enter valid email";

    if (!profile.experience.trim())
      newErrors.experience = "Required";

    if (!profile.workType)
      newErrors.workType = "Select work type";
  }

  if (step === 2) {
    if (
      (profile.workType === "Shop" ||
        profile.workType === "Both")
    ) {
     if (!/^[0-9]{6}$/.test(profile.pincode))
  newErrors.pincode = "Enter valid 6 digit pincode";
      if (!/^[0-9]{6}$/.test(profile.pincode))
        newErrors.pincode = "Enter valid 6 digit pincode";
    }
  }

  if (step === 3) {
    if (!/^[0-9]{12}$/.test(profile.aadhaarNumber))
      newErrors.aadhaarNumber =
        "Enter valid 12 digit Aadhaar number";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!validateStep()) return;

  const formData = new FormData();

  Object.entries(profile).forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, value as any);
    }
  });

  try {
    const res = await fetch("http://localhost:2007/Tailor/TailorDetails", {
  method: "POST",
  body: formData,
});

    const data = await res.json();
    console.log("Backend Response:", data);

    alert("Saved Successfully ");

  } catch (err) {
    console.log(err);
  }
};
  const showShopSection =
    profile.workType === "Shop" ||
    profile.workType === "Both";

  const showHomeSection =
  profile.workType === "Home" ||
  profile.workType === "Both";

  const inputStyle =
    "w-full px-4 py-2 text-sm rounded-lg bg-white text-[#5a4630] border border-[#e7c977] focus:outline-none focus:border-[#b8860b] transition-all duration-300";

  const labelStyle =
    "w-52 text-xs uppercase tracking-[3px] text-[#b8860b]";


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6e8] via-[#f6e7c8] to-[#e9c987] font-serif">

      <div className="w-[92%] max-w-6xl p-12 rounded-2xl bg-white/85 backdrop-blur-xl border border-[#e7c977] shadow-[0_50px_140px_rgba(180,130,40,0.35)] flex gap-12">

        {/* LEFT SECTION */}
        <div className="w-[65%] space-y-6">

          <div>
            <h2 className="text-4xl text-[#b8860b] tracking-wide">
              Heritage Tailoring Atelier
            </h2>
            <p className="text-sm tracking-[4px] uppercase text-[#d4a017] mt-3">
              Bespoke Craft Registration
            </p>
          </div>

          {/* STEP INDICATOR */}
          <div className="flex items-center gap-6 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                    ${step === s
                      ? "bg-[#b8860b] text-white"
                      : "bg-[#f3e4c4] text-[#b8860b]"
                    }`}
                >
                  {s}
                </div>
                {s !== 3 && (
                  <div className="w-10 h-[2px] bg-[#e7c977]" />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* STEP 1 */}
            {step === 1 && (
              <>
                {[
                  { label: "Shop Name", name: "shopName" },
                  { label: "Master Tailor Name", name: "ownerName" },
                  { label: "Contact Number", name: "phone" },
                  { label: "Email", name: "email" },
                  { label: "GST Number", name: "gst" },
                  { label: "Years of Experience", name: "experience" },
                  { label: "Instagram / Website", name: "socialLink" }
                ].map((field) => (
                  <div key={field.name} className="flex items-start gap-6">
                    <label className={labelStyle}>{field.label}</label>
                    <div className="w-full">
                      <input
                        name={field.name}
                        value={(profile as any)[field.name] || ""}
                        onChange={handleChange}
                        className={inputStyle}
                      />
                      {errors[field.name] && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex items-start gap-6">
  <label className={labelStyle}>Working Type</label>
  <div className="w-full">
    <select
      name="workType"
      value={profile.workType}
      onChange={handleChange}
      className={inputStyle}
    >
      <option value="">Select</option>
      <option>Home</option>
      <option>Shop</option>
      <option>Both</option>
    </select>

    {errors.workType && (
      <p className="text-xs text-red-600 mt-1">
        {errors.workType}
      </p>
    )}
  </div>
</div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                {showHomeSection && (
                  <textarea
                    name="personalAddress"
                    rows={3}
                    placeholder="Private Atelier Residence Details"
                    value={profile.personalAddress}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                )}

                {showShopSection && (
                  <div className="p-6 rounded-xl bg-[#fff8e6] border border-[#e9c987] space-y-4">
                    <h3 className="text-xs uppercase tracking-[4px] text-[#b8860b]">
                      Boutique Establishment Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">

  <input
    name="landmark"
    placeholder="Nearby Landmark"
    value={profile.landmark}
    onChange={handleChange}
    className={inputStyle}
  />

  <input
    name="floorNumber"
    placeholder="Floor / Unit Number"
    value={profile.floorNumber}
    onChange={handleChange}
    className={inputStyle}
  />

  <input
    name="area"
    placeholder="Locality / Area"
    value={profile.area}
    onChange={handleChange}
    className={inputStyle}
  />

  <input
    name="shopTimings"
    placeholder="Working Hours"
    value={profile.shopTimings}
    onChange={handleChange}
    className={inputStyle}
  />

  <input
    name="city"
    placeholder="City"
    value={profile.city}
    onChange={handleChange}
    className={inputStyle}
  />

  <input
    name="state"
    placeholder="State"
    value={profile.state}
    onChange={handleChange}
    className={inputStyle}
  />

  <input
    name="pincode"
    placeholder="Pincode"
    value={profile.pincode}
    onChange={handleChange}
    className={inputStyle}
  />

</div>

<textarea
  name="shopAddress"
  rows={2}
  placeholder="Complete Street Address"
  value={profile.shopAddress}
  onChange={handleChange}
  className={inputStyle}
/>
                  </div>
                )}
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <input
                  name="aadhaarNumber"
                  placeholder="Aadhaar Number"
                  value={profile.aadhaarNumber}
                  onChange={handleChange}
                  className={inputStyle}
                />
                {errors.aadhaarNumber && (
  <p className="text-xs text-red-600 mt-1">
    {errors.aadhaarNumber}
  </p>
)}

                <input
                  type="file"
                  name="aadhaarPhoto"
                  onChange={handleFileUpload}
                />
              </>
            )}

            {/* BUTTONS */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 rounded-lg border border-[#b8860b] text-[#b8860b]"
                >
                  Previous
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-2 rounded-lg bg-[#b8860b] text-white"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-8 py-2 rounded-lg bg-[#b8860b] text-white"
                >
                  SAVE ATELIER PROFILE
                </button>
              )}
            </div>

          </form>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-[35%] flex flex-col items-center justify-center space-y-8 border-l border-[#e7c977] pl-10">

          <label className="cursor-pointer">
            <div className="w-48 h-48 rounded-full border-4 border-[#b8860b]
              bg-white flex items-center justify-center overflow-hidden">

              {preview ? (
                <img src={preview} alt="Profile"
                  className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#b8860b] text-xs uppercase">
                  Upload Portrait
                </span>
              )}
            </div>

            <input
              type="file"
              name="profilePhoto"
              hidden
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label>

          <p className="text-[#b8860b] text-xl">
            {profile.ownerName || "Master Tailor"}
          </p>

        </div>
      </div>
    </div>
  );
};

export default TailorProfile;