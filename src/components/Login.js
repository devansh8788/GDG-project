import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import salesReportImage from '../assets/img-automate.png';
import logo from '../assets/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle regular email and password login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate('/dashboard'); // Navigate to dashboard on successful login
    } catch (error) {
      toast.error('Password incorrect. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  // Handle Google sign-in
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Google Login successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate('/dashboard'); // Navigate to dashboard on successful login
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer /> {/* Add ToastContainer to render toast messages */}
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl">
        {/* Left Side - Form Section */}
        <div className="w-1/2 p-8">
          <div className="text-center">
            <div className="text-center mb-5 flex justify-center">
              <img src={logo} alt="Logo" className="mx-auto h-16 w-auto" /> {/* Add your logo here */}
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Sign In</h1>
            <p className="mt-2 text-sm text-gray-600">Welcome back! Please enter your details.</p>
          </div>

          {/* Email & Password Inputs */}
          <div className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="remember" className="ml-2 text-gray-600">Remember for 30 Days</label>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot password?</Link>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            className="w-full mt-6 py-2 bg-[#2759CD] text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign In
          </button>

          {/* Divider with "OR" */}
          <div className="flex items-center justify-between my-6">
            <span className="w-full border-b border-gray-300"></span>
            <span className="px-4 text-gray-500">OR</span>
            <span className="w-full border-b border-gray-300"></span>
          </div>

          {/* Google & Facebook Sign-In */}
          <button
            onClick={signInWithGoogle}
            className="w-full py-2 mb-3 border border-black text-black font-semibold rounded-md hover:bg-[#2759CD] hover:text-white transition-all flex items-center justify-center"
          >
            <FcGoogle className="mr-2" size={20} />
            Sign in with Google
          </button>
          <button className="w-full py-2 border border-black text-black font-semibold rounded-md hover:bg-[#2759CD] hover:text-white transition-all flex items-center justify-center">
            <FaFacebook className="mr-2" size={20} />
            Sign in with Facebook
          </button>

          {/* Sign Up Link */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right Side - Graphic Section */}
        <div className="w-1/2 bg-[#2759CD] text-white flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
            <p className="text-lg mb-6">
              Please sign in to your INVOISED account.
            </p>
            {/* Placeholder Image or Chart */}
            <img
              src={salesReportImage}
              alt="Sales Report"
              className="w-full h-auto rounded-md mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
