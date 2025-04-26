import { useRouter } from 'next/router';
export default function Unauthorized() {
  const router = useRouter();
  
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">401 - Unauthorized</h1>
      <p>You don't have permission to view this page</p>
      <button 
        onClick={() => router.push('/')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Return Home
      </button>
    </div>
  );
}