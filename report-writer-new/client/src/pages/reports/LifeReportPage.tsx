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

const LifeReportPage = () => {
  const { personId } = useParams<{ personId?: string }>();
  const navigate = useNavigate();
  const { people } = usePeople();
  const { token } = useAuthStore();
  
  // Form state
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  
  // Set selected person if personId is provided in URL
  useEffect(() => {
    if (personId && people.length > 0) {
      const parsedId = parseInt(personId);
      const person = people.find(p => p.id === parsedId);
      if (person) {
        handlePersonSelect(parsedId);
      }
    }
  }, [personId, people]);
  
  // Handle person selection
  const handlePersonSelect = (id: number | null) => {
    setSelectedPersonId(id);
    
    if (id === null) {
      setSelectedPerson(null);
      return;
    }
    
    const person = people.find(p => p.id === id);
    if (person) {
      setSelectedPerson(person);
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedPersonId) {
      newErrors.personId = 'Please select a person';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setGenerating(true);
    
    try {
      // Get user settings from localStorage
      const userSettings = getUserSettings();
      
      // Generate the life report
      const reportResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/life`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          personId: selectedPersonId,
          originalDateFormat: selectedPerson?.originalDateFormat,
          // Include user settings
          userSettings: {
            logoPath: userSettings.logoPath,
            footerText: userSettings.footerText
          }
        }),
      });
      
      if (!reportResponse.ok) {
        throw new Error('Failed to generate report');
      }
      
      const reportData = await reportResponse.json();
      
      // Navigate to the report history page or download the report
      navigate('/dashboard/reports');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <FormLayout>
      <form onSubmit={handleSubmit}>
        <FormHeader 
          title="Life Report" 
          description="Generate a comprehensive life analysis based on the person's birth card and life spread."
        />

        <FormSection title="Person Information">
          <FormField 
            label="Select Person" 
            required
            error={errors.personId}
          >
            <PersonSelect
              value={selectedPersonId}
              onChange={handlePersonSelect}
              placeholder="Select a person"
              required
            />
          </FormField>

          {selectedPerson && (
            <FormField label="Birth Date">
              <p className="text-gray-700">
                {selectedPerson.originalDateFormat || 
                 // Format without timezone conversion to avoid date shifting
                 selectedPerson.birthdate.split('T')[0].split('-').reverse().join('/')}
              </p>
            </FormField>
          )}
        </FormSection>



        <FormFooter
          primaryButton={
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={generating || !selectedPersonId}
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

export default LifeReportPage;
