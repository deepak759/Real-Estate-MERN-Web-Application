import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFail,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
 
  const {loading,error}=useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  dispatch(signInStart())
    try {
      const res = await fetch("/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
      dispatch(signInFail(data.message))
        return;
      }
      dispatch(signInSuccess(data))
      navigate("/");
    } catch (error) {
    dispatch(signInFail(error.message))
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          id="email"
          className="border p-3 rounded-lg"
          placeholder="email..."
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          className="border p-3 rounded-lg"
          placeholder="password..."
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-100 disabled:opacity-70 "
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
       <OAuth/>
      </form>
      <p className="mt-5">
        Not Have an Account?
        <Link className="text-blue-700 px-2" to="/signup">
          Sign Up
        </Link>
      </p>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
