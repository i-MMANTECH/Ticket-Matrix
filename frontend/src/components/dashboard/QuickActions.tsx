// Emmanuel Aro's project submission for evaluation.
"use client";

import type { ReactNode } from "react";

import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";

type Action = {
  label: string;
  tone: "green" | "blue" | "purple";
  icon: ReactNode;
  onClick: () => void;
};

const TILE: Record<Action["tone"], string> = {
  green:  "bg-tile-green text-brand-700",
  blue:   "bg-tile-blue text-status-inProgressFg",
  purple: "bg-tile-purple text-purple-700",
};

export function QuickActions({ actions }: { actions: Action[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex items-center gap-3 border border-line bg-white px-4 py-3 text-left hover:border-ink-300 hover:bg-ink-50 transition-colors"
            >
              <span className={`inline-flex items-center justify-center h-9 w-9 ${TILE[action.tone]}`}>
                {action.icon}
              </span>
              <span className="text-sm font-medium text-ink-800">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
