'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notification from '@/components/Notification';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ open: false, message: '', type: 'success' });

    const res = await fetch('/api/protected', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });
    const data = await res.json();

    if (data.valid) {
      setNotification({ open: true, message: 'Valid API key, /protected can be accessed', type: 'success' });
      setTimeout(() => {
        setNotification({ open: false, message: '', type: 'success' });
        router.push('/protected');
      }, 1000); // Show notification for 1s, then redirect
    } else {
      setNotification({ open: true, message: 'Invalid API key', type: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">API Playground</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="Enter your API key"
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </div>
  );
}