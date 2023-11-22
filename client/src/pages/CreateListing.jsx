import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { set } from "mongoose";
export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormdata] = useState({ imageUrls: [] });
  const [uploadImagError, setUploadImageError] = useState(false);
const handleUploadImage = async (e) => {
  setLoading(true);

  if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
    setUploadImageError(null);
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }

    try {
      const urls = await Promise.all(promises);
      setFormdata({
        ...formData,
        imageUrls: formData.imageUrls.concat(urls),
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
      imageUrls: formData.imageUrls.filter((_, i) => i != index),
    });
  };
  console.log(formData);
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className=" flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg "
            id="name"
            maxLength={60}
            minLength={7}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg "
            id="description"
            maxLength={60}
            minLength={10}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg "
            id="address"
            maxLength={60}
            minLength={7}
            required
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularprice"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg border-gray-300"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedprice"
                min="1"
                max="10"
                required
                className="p-3 border rounded-lg border-gray-300"
              />
              <div className="flex flex-col items-center">
                <p>Discount price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
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
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
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
          <button className="p-3 bg-slate-700 text-white uppercase rounded-lg disabled:opacity-80">
            create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
