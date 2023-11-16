import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold  text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Property</span>
            <span className="text-slate-700 ">Hub</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg  flex items-center">
          <input
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
          />
          <FaSearch className="text-slate-700" />
        </form>
        <ul className=" flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className=" text-slate-700 hover:underline">About</li>
          </Link>
          <li className="hidden sm:inline text-slate-700 hover:underline">
            {currentUser ? (
              <Link to="/profile">
                <img className=" rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="" />
              </Link>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
