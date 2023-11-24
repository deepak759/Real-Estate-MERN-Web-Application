import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [isSale, setIsSale] = useState(true);
  const navigate=useNavigate();
  const [formData, setFormdata] = useState({
    imageURLs: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularprice: 50,
    discountedprice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploadImagError, setUploadImageError] = useState(false);
  const handleUploadImage = async (e) => {
    setLoading(true);

    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      setUploadImageError(null);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      try {
        const urls = await Promise.all(promises);
        setFormdata({
          ...formData,
          imageURLs: formData.imageURLs.concat(urls),
        });
        setUploadImageError(false);
      } catch (err) {
        setUploadImageError("Image upload failed (2 mb max per image)");
      }
    } else {
      setUploadImageError("You can only upload up to six images");
    }

    setLoading(false);
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageref = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageref, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },

        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormdata({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i != index),
    });
  };
  
  const handleChange = (e) => {
    if (e.target.id == "sale" || e.target.id == "rent") {
      setFormdata({
        ...formData,
        type: e.target.id,
      });
    }
   
    if (
      e.target.id == "furnished" ||
      e.target.id == "parking" ||
      e.target.id == "offer"
    ) {
      setFormdata({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormdata({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageURLs.length < 1)
        return setError("you must upload at least 1 image");
      if (+formData.regularprice <= +formData.discountedprice)
        return setError("discounted price should be less than regular price");

      setSubmitLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      console.log(data);
console.log(currentUser._id)
      if (data.success === false) {
        setError(data.message);
      }
      setSubmitLoading(false);
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error);
      setSubmitLoading(false);
    }
  };
  console.log(formData);
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className=" flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg "
            id="name"
            maxLength={60}
            minLength={7}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg "
            id="description"
            maxLength={60}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg "
            id="address"
            maxLength={60}
            minLength={7}
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className=" flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg border-gray-300"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg border-gray-300"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularprice"
                min="50"
                max="100000000"
                required
                className="p-3 border rounded-lg border-gray-300"
                onChange={handleChange}
                value={formData.regularprice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
          {formData.offer &&  <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedprice"
                min="0"
                max="10000000"
                required
                className="p-3 border rounded-lg border-gray-300"
                onChange={handleChange}
                value={formData.discountedprice}
              />
              <div className="flex flex-col items-center">
                <p>Discount price</p>
             <span className="text-xs">($/month)</span>
              </div>
            </div>}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold ">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              The first image will be Cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-200 rounded w-full"
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              onClick={handleUploadImage}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg uppercase disabled:opacity-70"
            >
              {loading ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-800">{uploadImagError && uploadImagError}</p>
          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => {
              return (
                <div
                  key={url}
                  className=" flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="image"
                    className="h-20 w-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 uppercase rounded-lg hover:opacity-95"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button
            disabled={submitLoading || loading}
            className="p-3 bg-slate-700 text-white uppercase rounded-lg disabled:opacity-80"
          >
            {submitLoading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}
