import React from 'react';
import { FormExamples } from '../components/forms';

/**
 * FormComponentsDemo page
 * 
 * This page demonstrates the form components in action.
 * It's a simple wrapper around the YearlyReportFormExample component.
 */
const FormComponentsDemo: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Components Demo</h1>
        <p className="text-gray-600">
          This page demonstrates the form components in action. Below is an example of a yearly report form
          that uses all the form components.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <FormExamples.YearlyReportFormExample />
      </div>
    </div>
  );
};

export default FormComponentsDemo;
