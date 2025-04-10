import React from "react"; 
export default function TestTailwind() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-7xl font-bold text-blue-600">Tailwind CSS is Working! 🎉</h1>

      <p className="mt-4 text-lg text-gray-700">This text is styled using Tailwind classes.</p>
      <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
  Click Me
</button>

    </div>
  );
}
