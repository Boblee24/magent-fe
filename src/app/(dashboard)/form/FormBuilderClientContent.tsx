"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdArrowBackIos } from "react-icons/md";
import FormBuilderClientWrapper from "@/components/forms/form-builder/FormBuilderClientWrapper";
import { apiClient } from "@/utils/apiClient";
import { FormField } from "@/lib/form.types";

interface Props {
  formId?: string;
}

export default function FormBuilderClientContent({ formId }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [initialFields, setInitialFields] = useState<FormField[]>([]);
  const [initialTitle, setInitialTitle] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [campaignId, setCampaignId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cid = searchParams.get("campaignId");
    const isEdit = !!formId;

    if (isEdit) {
      const fetchForm = async () => {
        try {
          const form = await apiClient(`/form/${formId}`);
          setInitialFields(form.fields || []);
          setInitialTitle(form.title || "");
          setInitialDescription(form.description || "");
          const campaign = form.campaignId?._id || form.campaignId;
          setCampaignId(campaign);
        } catch (err) {
          console.error("Failed to load form", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchForm();
    } else {
      setCampaignId(cid ?? undefined);
      setIsLoading(false);
    }
  }, [formId, searchParams]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-900"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-1 md:px-6 md:py-4 sm:px-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
          >
            <MdArrowBackIos size={16} className="mr-1" />
            Back
          </button>
          {campaignId && (
            <span className="text-xs text-gray-400 whitespace-nowrap">
              Campaign ID: {campaignId}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              {formId ? "Edit Form" : "Create Form"}
            </h1>
            {/* <p className="text-sm text-gray-500">
              {campaignId
                ? `Form for Campaign: ${campaignId}`
                : "No Campaign Linked"}
            </p> */}
          </div>
        </div>
      </div>

      {/* Form Builder */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1440px] mx-auto ">
          <FormBuilderClientWrapper
            initialFields={initialFields}
            initialTitle={initialTitle}
            initialDescription={initialDescription}
            campaignId={campaignId}
            formId={formId}
          />
        </div>
      </div>
    </main>
  );
}
