interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

export function SimpleAdminTable<T extends { id: string }>({
  title,
  description,
  rows,
  columns,
  emptyMessage,
}: {
  title: string;
  description?: string;
  rows: T[];
  columns: Column<T>[];
  emptyMessage: string;
}) {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-purple-600">{title}</h1>
      {description && <p className="mt-1 text-sm text-charcoal/60">{description}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              {columns.map((c) => (
                <th key={c.header} className="px-4 py-3">{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-purple-600/5 last:border-0">
                {columns.map((c) => (
                  <td key={c.header} className="px-4 py-3">{c.render(row)}</td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-charcoal/50">{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
