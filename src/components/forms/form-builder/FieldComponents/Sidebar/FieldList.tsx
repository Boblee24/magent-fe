// components/form-builder/Sidebar/FieldList.tsx
import React from 'react';
import { FieldType } from '@/lib/form.types';

const AVAILABLE_FIELDS: { label: string; type: FieldType }[] = [
  { label: 'Text', type: 'text' },
//   { label: 'Textarea', type: 'textarea' },
//   { label: 'Email', type: 'email' },
//   { label: 'Number', type: 'number' },
  { label: 'Radio', type: 'radio' },
  { label: 'Checkbox', type: 'checkbox' },
  { label: 'Select', type: 'select' },
  { label: 'Slider', type: 'slider' },
  { label: 'Date', type: 'date' },
//   { label: 'File', type: 'file' },
//   { label: 'Rating', type: 'rating' }
];

interface FieldListProps {
  onAddField: (type: FieldType) => void;
}

export const FieldList: React.FC<FieldListProps> = ({ onAddField }) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_FIELDS.map((field) => (
          <button
            key={field.type}
            onClick={() => onAddField(field.type)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          >
            + {field.label}
          </button>
        ))}
      </div>
    </div>
  );
};