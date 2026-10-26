import React, { useState, useEffect, useRef } from 'react';

interface EditableNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number | string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  title?: string;
  allowEmptyToReset?: boolean;
  onResetEmpty?: () => void;
}

export const EditableNumberInput: React.FC<EditableNumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 'any',
  decimals,
  prefix,
  suffix,
  placeholder,
  className = '',
  inputClassName = '',
  disabled = false,
  title,
  allowEmptyToReset = false,
  onResetEmpty,
}) => {
  const formatVal = (val: number) => {
    if (!Number.isFinite(val)) return '0';
    if (decimals !== undefined) {
      return Number(val.toFixed(decimals)).toString();
    }
    return String(val);
  };

  const [draft, setDraft] = useState<string>(() => formatVal(value));
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setDraft(formatVal(value));
    }
  }, [value, isFocused, decimals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDraft(raw);

    if (raw.trim() === '' || raw === '-' || raw === '.' || raw === '-.') {
      return;
    }

    const parsed = Number(raw);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      onChange(parsed);
    }
  };

  const commitValue = () => {
    setIsFocused(false);
    const trimmed = draft.trim();
    if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
      if (allowEmptyToReset && onResetEmpty) {
        onResetEmpty();
        return;
      }
      const fallback = min !== undefined ? Math.max(min, 0) : value;
      onChange(fallback);
      setDraft(formatVal(fallback));
      return;
    }

    let parsed = Number(trimmed);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      setDraft(formatVal(value));
      return;
    }

    if (min !== undefined && parsed < min) {
      parsed = min;
    }
    if (max !== undefined && parsed > max) {
      parsed = max;
    }

    onChange(parsed);
    setDraft(formatVal(parsed));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`inline-flex items-center bg-[#06090F] border border-[#1E293B] focus-within:border-[#00F0FF] rounded transition-colors ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`} title={title}>
      {prefix && (
        <span className="pl-2 pr-0.5 text-[10px] font-mono text-[#64748B] select-none shrink-0">
          {prefix}
        </span>
      )}
      <input
        ref={inputRef}
        type="number"
        step={step}
        disabled={disabled}
        placeholder={placeholder}
        value={draft}
        onFocus={(e) => {
          setIsFocused(true);
          e.target.select();
        }}
        onChange={handleChange}
        onBlur={commitValue}
        onKeyDown={handleKeyDown}
        className={`w-full bg-transparent px-1.5 py-1 text-right font-mono text-xs text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${inputClassName}`}
      />
      {suffix && (
        <span className="pr-2 pl-0.5 text-[10px] font-mono text-[#64748B] select-none shrink-0">
          {suffix}
        </span>
      )}
    </div>
  );
};
