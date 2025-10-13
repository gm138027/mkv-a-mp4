interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export const SelectField = <T extends string>({ label, value, options, labels, onChange, disabled = false }: SelectFieldProps<T>) => {
  return (
    <div className="select-field">
      <label className="select-field__label">{label}</label>
      <select className="select-field__select" value={value} onChange={(e) => onChange(e.target.value as T)} disabled={disabled}>
        {options.map((option) => (
          <option key={option} value={option}>{labels[option]}</option>
        ))}
      </select>
    </div>
  );
};
