import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)
  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log(formData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data =await res.json();
      if(data.success===false){
        console.log(data.message)
        setError(data.message)
        setLoading(false)
        return;
      }
      setLoading(false)
      setError(null)
      navigate('/signin')
    } catch (error) {
      setLoading(false)
      console.log(error)
      setError(error.message)
    }
   
   
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          id="username"
          className="border p-3 rounded-lg"
          placeholder="Username..."
          onChange={handleChange}
        />
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
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-100 disabled:opacity-70 "
        >
        {loading?"Loading...":"Sign Up"}
        </button>
       <OAuth/>
      </form>
      <p className="mt-5">
        Have an Account?
        <Link className="text-blue-700 px-2" to="/signin">
          Sign In
        </Link>
      </p>
    

      {error && (
        <p className="text-red-500">
   
         {error}
        
      </p>
      )}
    
    </div>
  );
}
