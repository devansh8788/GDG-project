import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword,signInWithPopup , setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FcGoogle } from 'react-icons/fc'; // Google Icon
import { FaFacebook } from 'react-icons/fa'; // Facebook Icon
import salesReportImage from '../assets/img-automate.png';
import logo from '../assets/logo.png';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Sign up with email and password
  const handleSignup = async () => {
    const auth = getAuth();
    await setPersistence(auth, browserLocalPersistence);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Navigate to dashboard on successful signup
    } catch (error) {
      console.error(error);
    }
  };

  // Sign up with Google
  const signUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard'); // Navigate to dashboard on successful Google signup
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl">
        {/* Left Side - Form Section */}
        <div className="w-1/2 p-8">
          <div className="text-center">
            <div className="text-center mb-5 flex justify-center">
              <img src={logo} alt="Logo" className="mx-auto h-16 w-auto" /> {/* Add your logo here */}
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Sign Up</h1>
            <p className="mt-2 text-sm text-gray-600">Join us by creating your account.</p>
          </div>

          {/* Name, Email & Password Inputs */}
          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
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

          {/* Sign Up Button */}
          <button
            onClick={handleSignup}
            className="w-full mt-6 py-2 bg-[#2759CD] text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </button>

          {/* Divider with "OR" */}
          <div className="flex items-center justify-between my-6">
            <span className="w-full border-b border-gray-300"></span>
            <span className="px-4 text-gray-500">OR</span>
            <span className="w-full border-b border-gray-300"></span>
          </div>

          {/* Google & Facebook Sign-Up */}
          <button
            onClick={signUpWithGoogle}
            className="w-full py-2 mb-3 border border-black text-black font-semibold rounded-md hover:bg-[#2759CD] hover:text-white transition-all flex items-center justify-center"
          >
            <FcGoogle className="mr-2" size={20} />
            Sign Up with Google
          </button>
          <button className="w-full py-2 border border-black text-black font-semibold rounded-md hover:bg-[#2759CD] hover:text-white transition-all flex items-center justify-center">
            <FaFacebook className="mr-2" size={20} />
            Sign Up with Facebook
          </button>

          {/* Login Link */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
        </div>

        {/* Right Side - Graphic Section */}
        <div className="w-1/2 bg-[#2759CD] text-white flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome!</h2>
            <p className="text-lg mb-6">
              Create your account and start using INVOISED.
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

export default Signup;
