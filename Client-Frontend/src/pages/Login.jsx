import { useContext, useState } from "react";
import {  useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";


const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state==="Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });
        if(data.success){
          setIsLoggedin(true);
          getUserData()
          navigate('/')
        }else{
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if(data.success){
          setIsLoggedin(true);
          navigate('/')
          getUserData()
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state==="Login" ? "Login" : "Create Account"}
        </h2>
        <p className="text-center mb-6 text-sm">
          {state==="Login" ? "Login to your account" : "Create your account"}
        </p>
        <form onSubmit={onSubmitHandler} autoComplete="off">
          {state==="Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="person" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                name="name"
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full name"
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="mail" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="lock" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          {state==="Login" && (
            <p
              onClick={() => navigate("/reset-pass")}
              className="mb-4 text-indigo-500 cursor-pointer"
            >
              Forgot password?
            </p>
          )}
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state==="Login" ? "Login" : "Sign Up"}
          </button>
        </form>
        {state==="Sign Up" ? (
          <p className="text-center mt-4 text-gray-400 text-xs">
            Already have an account? &nbsp;
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-center mt-4 text-gray-400 text-xs">
            Don{`'`}t have an account? &nbsp;
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
