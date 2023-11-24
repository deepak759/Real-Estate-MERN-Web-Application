import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFail,
  deleteUserFail,
  deleteUserStart,
  deleteUserSuccess,
  logOutUserStart,
  logOutUserFail,
  logOutUserSuccess,
} from "../redux/user/userSlice";

import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormdata] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [listing, setListing] = useState([]);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      console.log(file);
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setFileUploadErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormdata({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFail(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFail(error.message));
    }
  };
  console.log(formData);
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFail(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFail(error.message));
    }
  };
  const handleLogOut = async () => {
    try {
      dispatch(logOutUserStart());
      const res = await fetch(`/api/user/logout`);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(logOutUserFail(data.message));
        return;
      }

      dispatch(logOutUserSuccess(data));
    } catch (error) {
      dispatch(logOutUserFail(error.message));
    }
  };
  const handleShowListing = async () => {
    try {
      setListingError(false);
      const res = await fetch(`/api/listing/get/${currentUser._id}`);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setListingError(true);
      }
      setListing(data);
      console.log(data);
    } catch (error) {
      setListingError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          hidden
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt="profile picture"
        />
        <p className="self-center">
          {fileUploadErr ? (
            <span className="text-red-700">Something Went Wrong</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-green-800">{`Uploading ${filePerc}%`}</span>
          ) : filePerc >= 100 ? (
            <span className="text-green-600">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "update"}
        </button>

        <Link
          to={"/create-listing"}
          className="bg-green-700 text-center text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          create listing
        </Link>
      </form>
      <div className="justify-between flex mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span onClick={handleLogOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p>
        {error && <p className="text-red-500">{error}</p>}
        {updateSuccess && (
          <p className="text-green-500 pt-4 ">User Updated Successfully</p>
        )}
      </p>
      <button
        onClick={handleShowListing}
        className="text-green-700 w-full text-center"
      >
        Show Listing
      </button>
      <p className="text-red-500">
        {listingError ? "Eror Showing Listing" : ""}
      </p>
      {listing && listing.length > 0 && (
        <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold ">Your Listings</h1>
          {listing.map((list) => (
            <div
              key={list._id}
              className="border rounded-lg p-3 flex justify-between items-center"
            >
              <Link to={`/listing/${list._id}`}>
                <img
                  src={list.imageURLs[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${list._id}`}
                className=" text-slate-700 pl-2 font-semibold  hover:underline  truncate flex-1"
              >
                <p>{list.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button className="uppercase text-red-700   ">delete</button>
                <button className="uppercase text-green-700   ">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
