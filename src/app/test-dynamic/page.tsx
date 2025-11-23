"use client";
import { useEffect, useState } from 'react';

export default function TestDynamic() {
  const [footerData, setFooterData] = useState(null);
  const [dynamicPages, setDynamicPages] = useState(null);

  useEffect(() => {
    // Test footer settings API
    fetch('/api/footer-settings')
      .then(res => res.json())
      .then(data => setFooterData(data));

    // Test dynamic pages API
    fetch('/api/dynamic-pages/slug/hello')
      .then(res => res.json())
      .then(data => setDynamicPages(data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dynamic System Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Footer Settings:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(footerData, null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Dynamic Page (hello):</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(dynamicPages, null, 2)}
        </pre>
      </div>
    </div>
  );
}