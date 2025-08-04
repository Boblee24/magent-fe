// components/form-builder/FormCanvas.tsx
import React, { useRef } from "react";
import { FormField } from "@/lib/form.types";
import { useDrag, useDrop } from "react-dnd";

interface FormCanvasProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string) => void;
  onReorderFields: (dragIndex: number, hoverIndex: number) => void;
}

// DraggableField renders a single field box
const DraggableField: React.FC<{
  field: FormField;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  moveField: (dragIndex: number, hoverIndex: number) => void;
}> = ({ field, index, isSelected, onClick, moveField }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FIELD",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FIELD",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveField(item.index, index);
        item.index = index;
      }
    },
  }));

  drag(drop(ref));

  // Field type icons
  const getFieldIcon = (type: string) => {
    switch (type) {
      case "text":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        );
      case "radio":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "checkbox":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "select":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        );
      case "slider":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
        );
      case "date":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  return (
    <div
      ref={ref}
      onClick={() => {
        // console.log("Clicking field:", field.id, "Selected will be:", field.id);
        window.scrollTo({ top: 100, behavior: "smooth" });
        onClick();
      }}
      className={`
        group relative p-4 border-2 border-dashed rounded-lg cursor-move transition-all duration-200
        ${
          isSelected
            ? "border-purple-400 bg-purple-50 shadow-md"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        }
        ${isDragging ? "opacity-50 scale-95" : "opacity-100"}
        ${isOver ? "border-purple-300 bg-purple-25" : ""}
      `}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M16 4h2a2 2 0 012 2v2M16 20h2a2 2 0 002-2v-2"
          />
        </svg>
      </div>

      {/* Field Content */}
      <div className="flex items-center gap-3">
        <div
          className={`
          flex-shrink-0 p-2 rounded-full
          ${
            isSelected
              ? "bg-purple-100 text-purple-600"
              : "bg-gray-100 text-gray-600"
          }
        `}
        >
          {getFieldIcon(field.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {field.label || "Untitled Field"}
            </h4>
            {field.required && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Required
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
              {field.type}
            </span>
            {field.placeholder && (
              <span className="text-xs text-gray-500 truncate">
                "{field.placeholder}"
              </span>
            )}
          </div>

          {/* Options preview for select/radio/checkbox */}
          {field.config.options && field.config.options.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {field.config.options.length} option
              {field.config.options.length !== 1 ? "s" : ""}:
              <span className="ml-1">
                {field.config.options
                  .slice(0, 2)
                  .map((opt) => opt.label)
                  .join(", ")}
                {field.config.options.length > 2 && "..."}
              </span>
            </div>
          )}
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Field Number */}
      <div className="absolute -left-2 -top-2 w-6 h-6 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
        {index + 1}
      </div>
    </div>
  );
};

export const FormCanvas: React.FC<FormCanvasProps> = ({
  fields,
  selectedFieldId,
  onSelectField,
  onReorderFields,
}) => {
  return (
    <div className="min-h-[400px]">
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 30a9.971 9.971 0 018.287 6.286"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No fields added yet
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Start building your form by adding fields from the buttons above
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
            Click any field type to get started
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Click on a field to edit it, or drag to reorder
          </div>

          {fields
            .sort((a, b) => a.order - b.order)
            .map((field, index) => (
              <DraggableField
                key={`${field.id}-${index}`}
                field={field}
                index={index}
                isSelected={field.id === selectedFieldId}
                onClick={() => onSelectField(field.id)}
                moveField={onReorderFields}
              />
            ))}

          {/* Form completion indicator */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Form preview ready • {fields.length} field
              {fields.length !== 1 ? "s" : ""} added
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
