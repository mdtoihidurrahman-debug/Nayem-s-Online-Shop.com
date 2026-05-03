/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Firebase Auth Profile
      await updateProfile(user, { displayName: name });

      // 3. Create Firestore Document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        createdAt: serverTimestamp(),
      });

      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if profile exists, if not create it
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          displayName: user.displayName || 'User',
          email: user.email,
          createdAt: serverTimestamp(),
        });
      }

      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to register with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Join Nayem's Online Shop today</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full py-4 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-0 transition-all outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Gmail Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type="email"
                placeholder="email@example.com"
                className="w-full py-4 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-0 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full py-4 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-0 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full py-4 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-0 transition-all outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full mt-4 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Register Account <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
