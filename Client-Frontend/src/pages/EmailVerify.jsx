/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, userData, getUserData, isLoggedin } =
    useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const value = e.clipboardData.getData("text");
    const valueArray = value.split("");
    valueArray.forEach((v, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = v;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otp = inputRefs.current.map((ref) => ref.value).join("");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedin && userData && userData.userData.verifiedStatus) {
      navigate("/");
    }
  }, [isLoggedin, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verification OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the six digit code sent to your email.
        </p>
        <div className="flex justify-between mb-8">
          {/* Inserting input field one by one makes code longer 
          use array .fill.map method */}
          {/* <input type="text" className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md " required maxLength={1} />
          <input type="text" className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md " required maxLength={1} />
          <input type="text" className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md " required maxLength={1} />
          <input type="text" className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md " required maxLength={1} />
          <input type="text" className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md " required maxLength={1} />
          <input type="text" className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md " required maxLength={1} /> */}
          {Array(6)
            .fill(0)
            .map((_, index) => {
              return (
                <input
                  type="text"
                  key={index}
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  required
                  maxLength={1}
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              );
            })}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white  text-xl">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
