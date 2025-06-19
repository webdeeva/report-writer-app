import React, { useState } from 'react';
import {
  FormLayout,
  FormHeader,
  FormSection,
  FormField,
  FormFooter,
  PersonSelect,
  OptionCheckbox,
  MultiSelect,
  PromptTextarea,
  TextDateInput
} from '../';
import { Option } from '../fields';

/**
 * YearlyReportFormExample component
 * 
 * This is an example component that demonstrates how to use the form components.
 * It creates a form for generating a yearly report.
 */
const YearlyReportFormExample: React.FC = () => {
  // Form state
  const [personId, setPersonId] = useState<number | null>(null);
  const [customDate, setCustomDate] = useState<string>('');
  const [includeAstrology, setIncludeAstrology] = useState<boolean>(true);
  const [includeTarot, setIncludeTarot] = useState<boolean>(true);
  const [includeNumerology, setIncludeNumerology] = useState<boolean>(true);
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Example aspects for MultiSelect
  const aspectOptions: Option[] = [
    { value: 'career', label: 'Career & Work' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'finances', label: 'Finances' },
    { value: 'personal', label: 'Personal Growth' },
    { value: 'spirituality', label: 'Spirituality' },
    { value: 'creativity', label: 'Creativity' },
    { value: 'travel', label: 'Travel & Adventure' }
  ];

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!personId) {
      newErrors.personId = 'Please select a person';
    }

    if (selectedAspects.length === 0) {
      newErrors.aspects = 'Please select at least one aspect';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted with:', {
        personId,
        customDate,
        includeAstrology,
        includeTarot,
        includeNumerology,
        selectedAspects,
        prompt
      });
      
      setIsSubmitting(false);
      
      // Show success message or redirect
      alert('Report generated successfully!');
    }, 1500);
  };

  return (
    <FormLayout>
      <form onSubmit={handleSubmit}>
        <FormHeader 
          title="Generate Yearly Report" 
          description="Create a personalized yearly analysis report based on playing cards, astrology, and numerology."
        />

        <FormSection title="Person Information">
          <FormField 
            label="Select Person" 
            required
            error={errors.personId}
          >
            <PersonSelect
              value={personId}
              onChange={setPersonId}
              placeholder="Select a person"
              required
            />
          </FormField>

          <FormField 
            label="Custom Date (Optional)" 
            helpText="Leave blank to use today's date"
          >
            <TextDateInput
              value={customDate}
              onChange={setCustomDate}
              placeholder="MM/DD/YYYY"
            />
          </FormField>
        </FormSection>

        <FormSection title="Report Options" collapsible>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Include Astrology">
              <OptionCheckbox
                label="Include Astrology"
                checked={includeAstrology}
                onChange={setIncludeAstrology}
                description="Add astrological insights to the report"
              />
            </FormField>

            <FormField label="Include Tarot">
              <OptionCheckbox
                label="Include Tarot"
                checked={includeTarot}
                onChange={setIncludeTarot}
                description="Add tarot card interpretations to the report"
              />
            </FormField>

            <FormField label="Include Numerology">
              <OptionCheckbox
                label="Include Numerology"
                checked={includeNumerology}
                onChange={setIncludeNumerology}
                description="Add numerological insights to the report"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Report Focus">
          <FormField 
            label="Select Aspects to Focus On" 
            required
            error={errors.aspects}
          >
            <MultiSelect
              options={aspectOptions}
              value={selectedAspects}
              onChange={setSelectedAspects}
              placeholder="Select aspects to focus on"
            />
          </FormField>

          <FormField 
            label="Custom Prompt (Optional)" 
            helpText="Add specific questions or areas you'd like the report to address"
          >
            <PromptTextarea
              value={prompt}
              onChange={setPrompt}
              placeholder="Enter any specific questions or areas you'd like the report to address..."
              maxLength={1000}
            />
          </FormField>
        </FormSection>

        <FormFooter
          primaryButton={
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generating...' : 'Generate Report'}
            </button>
          }
          secondaryButton={
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
          }
        />
      </form>
    </FormLayout>
  );
};

export default YearlyReportFormExample;
