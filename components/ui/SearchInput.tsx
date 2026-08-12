import { Search } from "lucide-react";

export function SearchInput({ placeholder, basePath, defaultValue }: { placeholder: string; basePath: string; defaultValue?: string }) {
  return (
    <form action={basePath} method="GET" role="search" className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" aria-hidden="true" />
      <label htmlFor="q" className="sr-only">
        {placeholder}
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-full border border-purple-600/15 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-purple-600"
      />
    </form>
  );
}
