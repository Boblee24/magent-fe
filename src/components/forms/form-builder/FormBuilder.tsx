// components/form-builder/FormBuilder.tsx
import React, { useState, useCallback } from "react";
import { generateUUID, getDefaultConfig } from "@/utils/formHelpers";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FormField, FormBuilderState, FieldType } from "@/lib/form.types";
import { FieldList } from "./FieldComponents/Sidebar/FieldList";
import { FieldEditor } from "./FieldEditor";
import { FormPreview } from "../shared/FormPreview";
import { FormCanvas } from "./FormCanvas";
import { useRouter } from "next/navigation";
import { MdArrowBackIos } from "react-icons/md";

interface FormBuilderProps {
  initialFields?: FormField[];
  initialTitle?: string;
  initialDescription?: string;
  campaignId: string;
  isLoading: boolean;
  onSave: (formData: {
    title: string;
    description: string;
    campaignId: string;
    fields: FormField[];
  }) => void;
  onPreview: () => void;
  formId?: string;
}

interface ExtendedFormBuilderState extends FormBuilderState {
  title: string;
  description: string;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  initialFields = [],
  initialTitle = "",
  initialDescription = "",
  campaignId,
  isLoading,
  formId,
  onSave,
  onPreview,
}) => {
  const normalizedInitialFields = initialFields.map((field) => ({
    ...field,
    id: field.id || field._id, // Use id if exists, otherwise use _id
    _id: field._id || field.id, // Ensure _id is also set
  }));
  const [state, setState] = useState<ExtendedFormBuilderState>({
    fields: normalizedInitialFields,
    selectedFieldId: null,
    isDragging: false,
    previewMode: false,
    title: initialTitle,
    description: initialDescription,
  });
  // console.log(initialFields);

  const addField = useCallback(
    (fieldType: FieldType) => {
      const uuid = generateUUID();
      const newField: FormField = {
        id: uuid,
        _id: uuid,
        type: fieldType,
        label: `New ${fieldType} Field`,
        required: false,
        order: state.fields.length,
        validation: {},
        config: getDefaultConfig(fieldType),
      };

      setState((prev) => ({
        ...prev,
        fields: [...prev.fields, newField],
        selectedFieldId: newField.id,
      }));
    },
    [state.fields.length]
  );

  const updateField = useCallback(
    (fieldId: string, updates: Partial<FormField>) => {
      setState((prev) => ({
        ...prev,
        fields: prev.fields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field
        ),
      }));
    },
    []
  );

  const deleteField = useCallback((fieldId: string) => {
    setState((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
      selectedFieldId:
        prev.selectedFieldId === fieldId ? null : prev.selectedFieldId,
    }));
  }, []);

  const reorderFields = useCallback((dragIndex: number, hoverIndex: number) => {
    setState((prev) => {
      const dragField = prev.fields[dragIndex];
      const newFields = [...prev.fields];
      newFields.splice(dragIndex, 1);
      newFields.splice(hoverIndex, 0, dragField);

      return {
        ...prev,
        fields: newFields.map((field, index) => ({ ...field, order: index })),
      };
    });
  }, []);

  const handleSave = useCallback(() => {
    const formData = {
      title: state.title,
      description: state.description,
      campaignId,
      fields: state.fields,
    };
    onSave(formData);
  }, [state.title, state.description, state.fields, campaignId, onSave]);

  const updateFormInfo = useCallback(
    (field: "title" | "description", value: string) => {
      setState((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );
  const router = useRouter();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Form Builder
                </h1>
                {state.title && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Editing: {state.title}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      previewMode: !prev.previewMode,
                    }))
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {state.previewMode ? "Edit" : "Preview"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={!state.title.trim() || isLoading}
                  className="px-3 py-2 text-sm bg-[#330065] text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="hidden sm:inline">
                        {formId ? "Updating..." : "Publishing..."}
                      </span>
                    </>
                  ) : (
                    <span>{formId ? "Update" : "Publish"}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!state.previewMode ? (
            <div className="space-y-6">
              {/* Form Information Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Form Information
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form Title *
                    </label>
                    <input
                      type="text"
                      value={state.title}
                      onChange={(e) => updateFormInfo("title", e.target.value)}
                      placeholder="Enter form title"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form Description
                    </label>
                    <textarea
                      value={state.description}
                      onChange={(e) =>
                        updateFormInfo("description", e.target.value)
                      }
                      placeholder="Enter form description"
                      rows={2}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Field Management Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Fields Card */}
                <div className="bg-white rounded-lg border border-gray-200 px-4 py-2 sm:p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Add Fields
                  </h3>
                  <FieldList onAddField={addField} />
                </div>

                {/* Field Editor Card */}
                <div className="lg:col-span-2">
                  {state.selectedFieldId ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Edit Field
                        </h3>
                        <button
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              selectedFieldId: null,
                            }))
                          }
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <FieldEditor
                        field={
                          state.fields.find(
                            (f) => f.id === state.selectedFieldId
                          )!
                        }
                        onUpdate={(updates) =>
                          updateField(state.selectedFieldId!, updates)
                        }
                        onDelete={() => deleteField(state.selectedFieldId!)}
                      />
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-center">
                      <div className="text-gray-400 mb-2">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No Field Selected
                      </h3>
                      <p className="text-sm text-gray-500">
                        Select a field from the form below to edit its
                        properties
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Canvas */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Form Builder
                  </h3>
                  {state.fields.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {state.fields.length} field
                      {state.fields.length !== 1 ? "s" : ""} added
                    </div>
                  )}
                </div>
                <FormCanvas
                  fields={state.fields}
                  selectedFieldId={state.selectedFieldId}
                  onSelectField={(fieldId) =>
                    setState((prev) => ({ ...prev, selectedFieldId: fieldId }))
                  }
                  onReorderFields={reorderFields}
                />
              </div>
            </div>
          ) : (
            /* Preview Mode */
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Form Header in Preview */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {state.title || "Untitled Form"}
                  </h2>
                  {state.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {state.description}
                    </p>
                  )}
                </div>

                {/* Form Preview Content */}
                <div className="p-6">
                  <FormPreview fields={state.fields} />
                </div>
              </div>

              {/* Preview Actions */}
              <div className="mt-6 flex justify-center">
                <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Preview Mode
                  </div>
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        previewMode: false,
                      }))
                    }
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Back to Editor
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};
