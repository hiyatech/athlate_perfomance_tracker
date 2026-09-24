import React from 'react';

export default function ChipSelector({ options, selected, onSelect, multi = false, label }) {
  const isSelected = (val) => {
    if (multi) {
      return Array.isArray(selected) && selected.includes(val);
    }
    return selected === val;
  };

  const handleClick = (val) => {
    if (multi) {
      const arr = Array.isArray(selected) ? [...selected] : [];
      if (arr.includes(val)) {
        onSelect(arr.filter(item => item !== val));
      } else {
        onSelect([...arr, val]);
      }
    } else {
      onSelect(val);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = isSelected(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleClick(opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                active
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'bg-stone-100 text-brand-charcoal hover:bg-stone-200 border border-brand-border'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
