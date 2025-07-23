"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("加入成功！请关注邮箱通知。");
        setEmail("");
      } else {
        setMessage(data.error || "提交失败");
      }
    } catch {
      setMessage("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black">
      <h1 className="text-3xl font-bold mb-6">AI Maker Waitlist</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
        <input
          type="email"
          required
          placeholder="请输入邮箱"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
        >
          {loading ? "提交中..." : "Join Waitlist"}
        </button>
      </form>
      {message && <div className="mt-4 text-center text-red-600">{message}</div>}
    </div>
  );
}
