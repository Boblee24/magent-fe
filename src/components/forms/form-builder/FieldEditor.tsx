"use client";

import React, { useState, useEffect } from "react";
import { FormField } from "@/lib/form.types";

interface FieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate, onDelete }) => {
  const [options, setOptions] = useState(field.config.options || []);

  useEffect(() => {
    setOptions(field.config.options || []);
  }, [field.config.options]);

  const handleAddOption = () => {
    const newOption = { label: "New option", value: "New option" };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    onUpdate({ config: { ...field.config, options: updatedOptions } });
  };
  console.log('FieldEditor received field:', field);

  const handleOptionChange = (index: number, newLabel: string) => {
    const updatedOptions = options.map((opt, i) =>
      i === index ? { ...opt, label: newLabel, value: newLabel } : opt
    );
    setOptions(updatedOptions);
    onUpdate({ config: { ...field.config, options: updatedOptions } });
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    onUpdate({ config: { ...field.config, options: updatedOptions } });
  };

  const isOptionsField = ["radio", "select", "checkbox"].includes(field.type);

  return (
    <div className="space-y-4">
      {/* Field Type Badge */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
          {field.type} Field
        </div>
        <button
          onClick={onDelete}
          className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>

      {/* Basic Field Properties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field Label *
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Enter field label"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placeholder Text
          </label>
          <input
            type="text"
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Field Settings */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Field Settings</h4>
        
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">Required field</span>
        </label>
      </div>

      {/* Options editor for radio/select/checkbox */}
      {isOptionsField && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Field Options</h4>
            <button
              onClick={handleAddOption}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Option
            </button>
          </div>

          {options.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">No options added yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Option" to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {options.map((opt, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={opt.label}
                    placeholder="Enter option text"
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-all"
                    title="Remove option"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};