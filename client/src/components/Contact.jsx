import { list } from "firebase/storage";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landlord && (
        <div className="text-semibold gap-4 flex flex-col">
          <p>
            Contact <span className="text-bold">{landlord.username}</span> <span>for </span>
            <span className="text-bold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="border w-full border-gray-900 p-3 rounded-lg"
            name="message"
            id="message"
            rows="3"
            onChange={handleChange}
            value={message}
            placeholder="Enter Your Query"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700  text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Messge
          </Link>
        </div>
      )}
    </>
  );
}
