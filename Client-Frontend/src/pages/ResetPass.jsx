import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const ResetPass = () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [otp, setOtp] = useState(0);

  const { backendUrl } = useContext(AppContext);

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

  const onEmailFormSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-pass-reset-otp`,
       {email} 
      );
      if (data.success) {
        setIsEmailSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onOtpFormSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otp = inputRefs.current.map((ref) => ref.value).join("");
      setOtp(otp);
      setIsOtpSubmitted(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onNewPasswordFormSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email,otp,newPass }
      );
      if (data.success) {
        toast.success(data.message);
        navigate('/login')
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      {/* email form */}
      {!isEmailSent && (
        <form
          onSubmit={onEmailFormSubmitHandler}
          autoComplete="off"
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="mail" className="w-3 h-3" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
              className="bg-transparent outline-none text-white"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white mt-3">
            Submit
          </button>
        </form>
      )}

      {/* password reset otp input form */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onOtpFormSubmitHandler}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the six digit code sent to your email.
          </p>
          <div className="flex justify-between mb-8">
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
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white  ">
            Submit
          </button>
        </form>
      )}

      {/* New assword enter form */}
      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onNewPasswordFormSubmitHandler}
          autoComplete="off"
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new password
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="lock" className="w-3 h-3" />
            <input
              onChange={(e) => setNewPass(e.target.value)}
              value={newPass}
              name="email"
              className="bg-transparent outline-none text-white"
              type="password"
              placeholder="New Password"
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white mt-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPass;
