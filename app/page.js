// pages/login.js
"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async(e) => {
    e.preventDefault();
     
     const response = await fetch('/api/auth/login',{
      method:'POST',
      body:JSON.stringify({email,password})
     })
     const data = await response.json();

     
    if (response.ok) {
      alert('✅ Login Successful! Redirecting to dashboard...');
      // Redirect to the main admin page
      localStorage.setItem('token',data.token);
      router.push('/dashboard/admin'); 
      
    } else {
      alert('❌ Login Failed! Incorrect email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">
          Admin Login
        </h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          
          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="password123"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out cursor-pointer"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}