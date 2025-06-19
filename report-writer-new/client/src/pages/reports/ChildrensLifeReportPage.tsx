import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';
import PersonSelect from '../../components/forms/fields/PersonSelect';
import { formatDate } from '../../utils/dateUtils';
import { handleReportGenerationError } from '../../utils/reportErrorHandler';

interface FormData {
  personId: string;
}

const ChildrensLifeReportPage: React.FC = () => {
  console.log('[ChildrensLifeReportPage] Component loaded!');
  
  const { personId } = useParams<{ personId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [personName, setPersonName] = useState<string>('');
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      personId: personId || ''
    }
  });
  
  const selectedPersonId = watch('personId');
  
  useEffect(() => {
    if (personId) {
      setValue('personId', personId);
    }
  }, [personId, setValue]);
  
  const onPersonSelect = (id: number | null) => {
    setValue('personId', id ? id.toString() : '');
    // We don't need to set the person name as the component handles display
  };
  
  const onSubmit = async (data: FormData) => {
    if (!data.personId) {
      toast.error('Please select a person');
      return;
    }
    
    setGenerating(true);
    setPdfUrl(null);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('/api/reports/childrens-life', {
        personId: parseInt(data.personId),
        originalDateFormat: 'MM/DD/YYYY'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.pdfUrl) {
        setPdfUrl(response.data.pdfUrl);
        toast.success('Children\'s Life Report generated successfully!');
      } else {
        toast.error('Failed to generate report');
      }
    } catch (error) {
      handleReportGenerationError(error);
    } finally {
      setGenerating(false);
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Children's Life Report</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Generate Children's Life Report</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Child
            </label>
            <PersonSelect
              value={selectedPersonId ? parseInt(selectedPersonId) : null}
              onChange={onPersonSelect}
              placeholder="Select a child..."
            />
            {errors.personId && (
              <p className="text-red-500 text-xs italic mt-1">
                Please select a child
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              disabled={generating || !selectedPersonId}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </form>
      </div>
      
      {pdfUrl && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium mb-4">Report Preview</h2>
          <div className="mb-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block"
            >
              Open PDF
            </a>
          </div>
          <div className="aspect-w-8 aspect-h-11 border border-gray-300">
            <iframe
              src={`${pdfUrl}#view=FitH`}
              className="w-full h-full"
              title="Children's Life Report PDF"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildrensLifeReportPage;
