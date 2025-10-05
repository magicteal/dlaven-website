"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminCodesPage() {
  const [count, setCount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codes, setCodes] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCodes([]);
    if (!Number.isInteger(count) || count <= 0) {
      setError("Count must be a positive integer");
      return;
    }
    setLoading(true);
    try {
      const res = await api.adminGenerateCodes(count);
      setCodes(res.items || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate codes";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Generate Codes</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-black/70">How many codes?</span>
          <Input
            type="number"
            min={1}
            className="text-black"
            value={Number.isNaN(count) ? "" : count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            placeholder="e.g., 100"
          />
        </label>
        {/* Code length is fixed to 6 digits */}
        <div>
          <Button type="submit" disabled={loading}>
            {loading ? "Generating…" : "Generate"}
          </Button>
        </div>
      </form>
      {error && (
        <div className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
      {codes.length > 0 && (
        <div className="mt-6">
          <div className="text-sm text-black/70 mb-2">
            Generated codes ({codes.length}):
          </div>
          <div className="p-3 border rounded bg-white/50">
            <ul className="text-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {codes.map((c, i) => (
                <li key={i} className="font-mono tracking-wider">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
