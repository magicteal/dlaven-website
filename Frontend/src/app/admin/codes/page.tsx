"use client";
import { useEffect, useState } from "react";
import { api, API_BASE, type BatchHistoryItem } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminCodesPage() {
  const [count, setCount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<{
    items: string[];
    batch: number;
  } | null>(null);
  const [history, setHistory] = useState<BatchHistoryItem[] | null>(null);
  const [busyBatch, setBusyBatch] = useState<number | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.adminGetCodeBatchHistory();
      setHistory(res.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch history");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGenerated(null);
    if (!Number.isInteger(count) || count <= 0) {
      setError("Count must be a positive integer");
      return;
    }
    setLoading(true);
    try {
      const res = await api.adminGenerateCodes(count);
      setGenerated(res);
      fetchHistory();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate codes";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onDownload = (batchNumber: number) => {
    window.open(`${API_BASE}/api/codes/batch/${batchNumber}/download`);
  };

  const onDelete = async (batchNumber: number) => {
    if (
      !confirm(
        `Are you sure you want to delete all codes in batch #${batchNumber}?`
      )
    ) {
      return;
    }
    setBusyBatch(batchNumber);
    setError(null);
    try {
      await api.adminDeleteCodeBatch(batchNumber);
      // Update UI by removing the deleted batch from history
      setHistory((prev) =>
        prev ? prev.filter((b) => b.batch !== batchNumber) : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete batch");
    } finally {
      setBusyBatch(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-semibold mb-4">Generate Codes</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full max-w-sm">
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
      {generated && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-black/70">
              Generated codes (Batch #{generated.batch},{" "}
              {generated.items.length} codes):
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(generated.batch)}
            >
              Download PDF
            </Button>
          </div>
          <div className="p-3 border rounded bg-white/50 max-h-60 overflow-y-auto">
            <ul className="text-sm grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {generated.items.map((c, i) => (
                <li key={i} className="font-mono tracking-wider">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-lg font-semibold">Batch History</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-black/10">
                <th className="py-2 pr-4">Batch #</th>
                <th className="py-2 pr-4">Codes</th>
                <th className="py-2 pr-4">Date Created</th>
                <th className="py-2 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history === null ? (
                <tr>
                  <td colSpan={4} className="py-4 text-black/60">
                    Loading history...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-black/60">
                    No batches generated yet.
                  </td>
                </tr>
              ) : (
                history.map((h) => (
                  <tr key={h.batch} className="border-b border-black/5">
                    <td className="py-2 pr-4 font-medium">{h.batch}</td>
                    <td className="py-2 pr-4">{h.count}</td>
                    <td className="py-2 pr-4 text-black/70">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 pr-4 text-right flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(h.batch)}
                        disabled={busyBatch === h.batch}
                      >
                        Download
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(h.batch)}
                        disabled={busyBatch === h.batch}
                      >
                        {busyBatch === h.batch ? "Deleting..." : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
