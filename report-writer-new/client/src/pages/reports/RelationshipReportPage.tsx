import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FormLayout,
  FormHeader,
  FormSection,
  FormField,
  FormFooter,
  PersonSelect,
  OptionCheckbox
} from '@/components/forms';
import { usePeople } from '@/hooks/usePeople';
import { useAuthStore } from '@/context/authStore';
import { getUserSettings } from '@/services/localStorageService';

const RelationshipReportPage = () => {
  const navigate = useNavigate();
  const { people } = usePeople();
  const { token } = useAuthStore();
  
  // Form state
  const [person1Id, setPerson1Id] = useState<number | null>(null);
  const [person2Id, setPerson2Id] = useState<number | null>(null);
  const [person1, setPerson1] = useState<any | null>(null);
  const [person2, setPerson2] = useState<any | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  
  // Handle person selection
  const handlePerson1Select = (id: number | null) => {
    setPerson1Id(id);
    
    if (id === null) {
      setPerson1(null);
      return;
    }
    
    const person = people.find(p => p.id === id);
    if (person) {
      setPerson1(person);
    }
  };
  
  const handlePerson2Select = (id: number | null) => {
    setPerson2Id(id);
    
    if (id === null) {
      setPerson2(null);
      return;
    }
    
    const person = people.find(p => p.id === id);
    if (person) {
      setPerson2(person);
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!person1Id) {
      newErrors.person1Id = 'Please select the first person';
    }
    
    if (!person2Id) {
      newErrors.person2Id = 'Please select the second person';
    }
    
    if (person1Id === person2Id && person1Id !== null) {
      newErrors.person2Id = 'Please select a different person';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // State for error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setGenerating(true);
    setErrorMessage(null);
    
    try {
      // Get user settings from localStorage
      const userSettings = getUserSettings();
      
      // Generate the relationship report
      const reportResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/relationship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          person1Id,
          person2Id,
          // Include user settings
          userSettings: {
            logoPath: userSettings.logoPath,
            footerText: userSettings.footerText
          }
        }),
      });
      
      // Get the response text
      const responseText = await reportResponse.text();
      
      // Try to parse as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        // If not valid JSON, use the text as error message
        if (!reportResponse.ok) {
          throw new Error(responseText || 'Failed to generate report');
        }
      }
      
      if (!reportResponse.ok) {
        // If we have a JSON response with an error message, use it
        if (responseData && responseData.message) {
          throw new Error(responseData.message);
        }
        throw new Error('Failed to generate report');
      }
      
      // Navigate to the report history page or download the report
      navigate('/dashboard/reports');
    } catch (error: any) {
      console.error('Error generating report:', error);
      setErrorMessage(error.message || 'Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <FormLayout>
      <form onSubmit={handleSubmit}>
        <FormHeader 
          title="Relationship Report" 
          description="Generate a detailed relationship analysis based on the birth cards of two people."
        />

        <FormSection title="People Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Person 1 */}
            <FormField 
              label="Person 1" 
              required
              error={errors.person1Id}
            >
              <PersonSelect
                value={person1Id}
                onChange={handlePerson1Select}
                placeholder="Select first person"
                required
              />
              
              {person1 && (
                <p className="mt-2 text-sm text-gray-500">
                  Birth Date: {person1.originalDateFormat || 
                   // Format without timezone conversion to avoid date shifting
                   person1.birthdate.split('T')[0].split('-').reverse().join('/')}
                </p>
              )}
            </FormField>
            
            {/* Person 2 */}
            <FormField 
              label="Person 2" 
              required
              error={errors.person2Id}
            >
              <PersonSelect
                value={person2Id}
                onChange={handlePerson2Select}
                placeholder="Select second person"
                required
              />
              
              {person2 && (
                <p className="mt-2 text-sm text-gray-500">
                  Birth Date: {person2.originalDateFormat || 
                   // Format without timezone conversion to avoid date shifting
                   person2.birthdate.split('T')[0].split('-').reverse().join('/')}
                </p>
              )}
            </FormField>
          </div>
        </FormSection>



        {errorMessage && (
          <div className="mt-4 p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
            <p className="font-medium">Error generating report:</p>
            <p>{errorMessage}</p>
          </div>
        )}

        <FormFooter
          primaryButton={
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={generating || !person1Id || !person2Id}
            >
              {generating ? 'Generating...' : 'Generate Report'}
            </button>
          }
          secondaryButton={
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          }
        />
      </form>
    </FormLayout>
  );
};

export default RelationshipReportPage;
