"use client";

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { useRouter } from 'next/navigation';

export default function OnboardingStep1() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  
  const [images, setImages] = useState<{ [key: string]: File | null }>({
    front: null,
    back: null,
    left: null,
    right: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth?.loading && !auth?.user) {
      router.push('/login');
    }
  }, [auth, router]);

  const handleSingleImageChange = (position: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImages(prev => ({ ...prev, [position]: e.target.files![0] }));
    }
  };

  // Object values ko array mein convert karke count karna
  const uploadedCount = Object.values(images).filter(Boolean).length;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images.front || !images.back || !images.left || !images.right) {
      alert("Please upload all 4 body angles (Front, Back, Left, Right)");
      return;
    }

    const formData = new FormData();
    formData.append('images', images.front);
    formData.append('images', images.back);
    formData.append('images', images.left);
    formData.append('images', images.right);

    setLoading(true);
    try {
      await api.post('/analysis/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      router.push('/onboarding/step-2');
    } catch (error) {
      alert("Image analysis failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const poses = [
    { key: 'front', label: 'Front Pose' },
    { key: 'back', label: 'Back Pose' },
    { key: 'left', label: 'Left Side Pose' },
    { key: 'right', label: 'Right Side Pose' }
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4 selection:bg-orange-500 selection:text-black relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-orange-400 font-extrabold text-xs uppercase tracking-wider bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">Step 1 of 2</span>
          <h2 className="text-3xl font-black tracking-tight text-white mt-2">AI Body Analysis</h2>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-md mx-auto">
            Upload exactly 4 body images (Front, Back, Left, Right) for MediaPipe posture & BMI estimation.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {poses.map((pose) => (
              <div key={pose.key} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between">
                <span className="text-xs font-bold text-zinc-300 mb-2">{pose.label} {images[pose.key] ? '✓' : ''}</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleSingleImageChange(pose.key, e)}
                  className="w-full text-xs text-zinc-400 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-extrabold file:bg-orange-500 file:text-black hover:file:bg-orange-600 file:transition-all cursor-pointer"
                />
              </div>
            ))}
          </div>

          <p className="text-xs text-orange-400 font-bold text-center mt-2">
            {uploadedCount}/4 images selected {uploadedCount === 4 && "✓ All angles ready"}
          </p>

          <button 
            type="submit" 
            disabled={loading || uploadedCount !== 4}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm mt-2"
          >
            {loading ? 'Analyzing Posture & BMI...' : 'Next: Select Goal'}
          </button>
        </form>
      </div>
    </div>
  );
}