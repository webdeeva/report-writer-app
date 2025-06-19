import axios from 'axios';
import { toast } from 'react-toastify';

export const handleReportGenerationError = (error: unknown) => {
  console.error('Error generating report:', error);
  
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      // Timeout error - the report might still be generating
      toast.warning(
        'The report is taking longer than expected. Please check your report history in a few minutes.',
        { autoClose: 10000 } // Show for 10 seconds
      );
    } else if (error.response) {
      // Server responded with an error
      const message = error.response.data?.message || 'Failed to generate report';
      toast.error(`Error: ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      toast.error('Network error. Please check your connection and try again.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred while generating the report.');
    }
  } else {
    // Non-Axios error
    toast.error('An unexpected error occurred. Please try again.');
  }
};