// Emmanuel Aro's project submission for evaluation.
"use client";

import { useState } from "react";
import { mutate } from "swr";

import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { api } from "@/lib/api";

export function CommentComposer({ ticketId }: { ticketId: string }) {
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!author.trim() || !body.trim()) {
      setError("Name and message are required.");
      return;
    }

    setSubmitting(true);
    try {
      await api.addComment(ticketId, {
        author_name: author.trim(),
        author_email: email.trim() || undefined,
        content: body.trim(),
      });
      setBody("");
      await mutate(`/tickets/${ticketId}/`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="author" required>
            Your name
          </Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Support agent or customer name"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="comment" required>
          Add a comment
        </Label>
        <Textarea
          id="comment"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Reply to the customer or leave an internal note..."
          required
        />
      </div>
      {error ? (
        <div className="border border-danger/40 bg-red-50 px-3 py-2 text-xs text-danger">
          {error}
        </div>
      ) : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post comment"}
        </Button>
      </div>
    </form>
  );
}
