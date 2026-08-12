import { cn } from "@/lib/utils";

interface BaseProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export function TextField({
  label,
  name,
  error,
  required,
  hint,
  type = "text",
  defaultValue,
}: BaseProps & { type?: string; defaultValue?: string }) {
  return (
    <Field label={label} name={name} error={error} required={required} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass(Boolean(error))}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  name,
  error,
  required,
  hint,
  rows = 5,
  defaultValue,
}: BaseProps & { rows?: number; defaultValue?: string }) {
  return (
    <Field label={label} name={name} error={error} required={required} hint={hint}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass(Boolean(error))}
      />
    </Field>
  );
}

export function SelectField({
  label,
  name,
  error,
  required,
  hint,
  options,
  defaultValue,
}: BaseProps & { options: { value: string; label: string }[]; defaultValue?: string }) {
  return (
    <Field label={label} name={name} error={error} required={required} hint={hint}>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass(Boolean(error))}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckboxField({
  label,
  name,
  error,
  defaultChecked,
}: {
  label: React.ReactNode;
  name: string;
  error?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="flex items-start gap-3 text-sm text-charcoal/80">
        <input
          id={name}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className="mt-1 h-4 w-4 rounded border-purple-600/30 text-purple-600 focus-visible:outline-gold-500"
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Field({ label, name, error, required, hint, children }: BaseProps & { children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-charcoal">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {hint && <p className="mt-0.5 text-xs text-charcoal/50">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30",
    hasError ? "border-red-400" : "border-purple-600/15",
  );
}
