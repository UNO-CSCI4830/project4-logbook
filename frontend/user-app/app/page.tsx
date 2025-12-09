'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Homepage = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login if not authenticated, otherwise to dashboard
    if (localStorage.getItem('authToken')) {
      router.push('/user');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-gray-500'>Redirecting...</div>
    
    </div>
  );
};

export default Homepage