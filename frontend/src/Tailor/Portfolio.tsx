import { useState, useEffect } from "react";
import API from "../api/api";

export default function Portfolio() {


type ImageType = {
  _id: string;
  imageUrl: string;
  tag: string;
  description: string;
  featured?: boolean;
  views?: number;
};

  
 const [images, setImages] = useState<ImageType[]>([]);
const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");


  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    fetchPortfolio();
  }, []);

  // ================= FETCH =================
  const fetchPortfolio = async () => {
    try {
      const res= await API.get(`/Tailor/get-portfolio/${email}`);

      console.log("DATA:", res.data);
      setImages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };



  /* ================= CROP =================*/
  const cropImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height);

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );

        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
    });
  };



  const savePortfolio = async (data) => {
    try {
      
await API.post("/Tailor/update-portfolio", {
        email,
        images: data
      });
    } catch (err) {
      console.log(err);
    }
  };


  // ================= UPLOAD =================
 const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files);

    for (let file of files) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("image", file);
      formData.append("tag", "Bridal");
      formData.append("description", "");

      await API.post("/Tailor/add-portfolio", formData);
    }

    fetchPortfolio(); // 🔥 reload from backend
  };

  const filteredImages =
    filter === "All"
      ? images
      : images.filter((img: ImageType) => img.tag === filter);

  const toggleFeatured = (id) => {
    const updated = images.map(img =>
      img._id === id ? { ...img, featured: !img.featured } : img
    );

    setImages(updated);
    savePortfolio(updated);
  };

const openImage = (img) => {
  setSelectedImg(img.imageUrl);
};



  const changeDesc = (id, value) => {
    const updated = images.map(img =>
      img._id === id ? { ...img, description: value } : img
    );
    setImages(updated);
  };

  const changeTag = (id, tag) => {
    const updated = images.map(img =>
      img._id === id ? { ...img, tag } : img
    );
    setImages(updated);
  };

  const saveSingleImage = async (img) => {

    if (!img.description || img.description.trim().length < 5) {
      alert("Description must be at least 5 characters");
      return;
    }

    if (!img.tag) {
      alert("Please select a category");
      return;
    }

    try {
     await API.post("/Tailor/update-portfolio",  {
        email,
        images: images
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteImage = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this image?");
    if (!confirmDelete) return;

    try {
      await API.post("/Tailor/delete-portfolio", {
        email,
        imageId: id
      });

      fetchPortfolio();
    } catch (err) {
      console.log(err);
    }
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8ec] via-[#f4e7c3] to-[#e8c77a] px-6 py-8 font-serif">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl text-[#b8963f] tracking-widest">
          Atelier Portfolio
        </h1>
        <p className="text-[#8c7440] mt-2 tracking-[5px] uppercase text-xs">
          Crafted Elegance • Timeless Designs
        </p>
      </div>

      {/* COLLECTION */}
      <div className="mb-8 text-center">
        <h2 className="text-xl text-[#b8963f]">
          ✨ Spring Couture Drop
        </h2>
        <p className="text-[#8c7440] text-xs italic">
          A celebration of handcrafted luxury & fine detailing
        </p>
      </div>

      {/* UPLOAD */}
      <div className="flex justify-center mb-8">
        <label className="cursor-pointer group">
          <div className="px-8 py-3 rounded-full bg-gradient-to-r from-[#c6a75a] to-[#b8963f] text-white shadow-xl group-hover:scale-105 transition">
            ✨ Add New Creation
          </div>
          <input type="file" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {/* FILTER */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {["All", "Bridal", "Suit", "Lehenga"].map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-5 py-2 rounded-full text-xs ${filter === tag
              ? "bg-[#b8963f] text-white shadow-md"
              : "bg-white/70 text-[#8c7440]"
              }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* SHIMMER */}
      {loading && (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="mb-5 h-60 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          ))}
        </div>
      )}

      {/* 📌 PINTEREST STYLE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

        {Array.isArray(filteredImages) &&
          filteredImages.map((img, i) => (
            <div
              key={img._id || i}
              className="h-full flex flex-col group"
            >

              {/* LUXURY BORDER */}
              <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-[#c6a75a] via-[#f5e6b3] to-[#c6a75a]">

                <div className="rounded-3xl overflow-hidden bg-white">

                  {/* IMAGE */}
                  <div className="relative">

                    <img
                      src={img.imageUrl}
                      onClick={() => openImage(img)}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(img._id);
                      }}
                      className="absolute top-2 right-2 z-20 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg"
                    >
                      ✕
                    </button>
                  </div>


                  {/* GLASS REFLECTION */}
                  <div className="absolute inset-0 z-10 bg-white/10 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition pointer-events-none" />

                  {/* WATERMARK */}
                  <div className="absolute bottom-3 right-3 text-white/70 text-[10px] tracking-[3px]">
                    ATELIER
                  </div>

                  {/* FEATURED */}
                  {img.featured && (
                    <span className="absolute top-3 left-3 bg-[#b8963f] text-white text-[10px] px-3 py-1 rounded-full">
                      Signature Piece
                    </span>
                  )}

                  {/* VIEWS */}
                  <div className="absolute bottom-3 left-3 text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-full">
                    👁️ {img.views ?? 0}
                  </div>

                </div>
              </div>


              {/* DETAILS - LUXURY UPGRADE */}

              <div className="bg-gradient-to-br from-white/80 to-[#f9f1d7] backdrop-blur-xl p-4 rounded-2xl mt-3 border border-[#e6d3a3] shadow-[inset_0_2px_8px_rgba(184,150,63,0.2)] space-y-4 h-[260px] flex flex-col justify-between">
                {/* CATEGORY DROPDOWN */}
                <div className="relative">
                  <select
                    value={img.tag}
                    onChange={(e) => changeTag(img._id, e.target.value)}
                    className="w-full appearance-none px-4 py-2 rounded-xl text-xs text-[#8c7440]
bg-white
border border-[#e6d3a3]
shadow-sm
focus:outline-none focus:ring-2 focus:ring-[#c6a75a]" >
                    <option>Bridal</option>
                    <option>Suit</option>
                    <option>Lehenga</option>
                  </select>

                  {/* custom arrow */}
                  <span className="absolute right-3 top-2.5 text-[#b8963f] text-xs">▼</span>
                </div>

                {/* DESCRIPTION */}
                <textarea
                  placeholder=" Describe fabric, embroidery, inspiration..."
                  value={img.description}
                  onChange={(e) => changeDesc(img._id, e.target.value)}
                  className="w-full  h-20 resize-none px-4 py-3 rounded-xl text-xs text-black
    bg-gradient-to-br from-white to-[#fdf6e3]
    border border-[#e6d3a3]
    shadow-inner
    focus:outline-none focus:ring-2 focus:ring-[#c6a75a]
    placeholder:text-[#c6a75a]"
                />

                <div className="flex gap-3 mt-2">

                  {/* 💾 SAVE */}
                  <button
                    onClick={() => saveSingleImage(img)}
                    disabled={!img.description || img.description.trim().length < 5}
                    className={`flex-1 py-2 text-xs rounded-xl text-white transition duration-300
${
  !img.description || img.description.trim().length < 5
    ? "bg-[#d8c79a] cursor-not-allowed"
    : "bg-gradient-to-r from-[#c6a75a] to-[#b8963f] hover:scale-[1.03] shadow-md"
}`}
                  >
                    Save
                  </button>

                  {/* 🔄 UPDATE */}
                  <button
                    onClick={() => saveSingleImage(img)}
                    className="flex-1 py-2 text-xs rounded-xl text-white
bg-gradient-to-r from-[#c6a75a] to-[#b8963f]
shadow-md
hover:scale-[1.03]
transition duration-300"
                  >
                    Update
                  </button>

                </div>
                {/* SIGNATURE BUTTON */}
                <button
                  onClick={() => toggleFeatured(img._id)}
                  className="w-full py-2.5 text-xs rounded-xl text-white tracking-wide
bg-gradient-to-r from-[#c6a75a] to-[#b8963f]
shadow-lg
hover:scale-[1.02]
transition duration-300 flex items-center justify-center gap-2">
                  {img.featured ? "Signature Added" : "Mark as Signature Design"}
                </button>



              </div>
            </div>
          ))}

      </div>

      {/* EMPTY */}
      {images.length === 0 && !loading && (
        <div className="text-center mt-16 text-[#8c7440]">
          <p className="text-lg">No Creations Yet</p>
          <p className="text-xs italic">Start building your luxury portfolio ✨</p>
        </div>
      )}

      {/* MODAL */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-[#f4e7c3]/90 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setSelectedImg(null)}
        >
          <img
            src={selectedImg}
            onClick={(e) => e.stopPropagation()} // 🔥 FIX
            className="max-h-[85%] max-w-[85%] rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.3)] border border-[#e6d3a3]"
          />
        </div>
      )}

    </div>
  );
}