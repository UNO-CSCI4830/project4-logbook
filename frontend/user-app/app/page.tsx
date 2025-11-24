'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Homepage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    // edit from Ashley: changed this to login so it appears first
    router.push('/login');
  }, [router]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-gray-500'>Redirecting...</div>
    </div>
  )
}

export default Homepage