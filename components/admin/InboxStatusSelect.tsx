"use client";

import { updateInboxStatusAction } from "@/lib/actions/admin-inbox";

export function InboxStatusSelect({
  table,
  id,
  statusColumn,
  currentStatus,
  options,
}: {
  table: string;
  id: string;
  statusColumn: string;
  currentStatus: string;
  options: string[];
}) {
  return (
    <form
      action={(formData) => updateInboxStatusAction(table, id, statusColumn, formData)}
      onChange={(e) => (e.currentTarget as HTMLFormElement).requestSubmit()}
    >
      <select name={statusColumn} defaultValue={currentStatus} className="rounded-lg border border-purple-600/15 bg-white px-3 py-1.5 text-xs capitalize">
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </form>
  );
}
