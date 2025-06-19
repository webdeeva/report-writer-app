import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePeople, Person } from '@/hooks/usePeople';
import { calculateAge, toDisplayDateString } from '@/utils/dateUtils';

const PeoplePage = () => {
  const { people, loading, error, deletePerson, fetchPeople } = usePeople();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const handleDelete = async (id: number) => {
    if (await deletePerson(id)) {
      setDeleteConfirmId(null);
    }
  };
  
  // Function to get the display date
  const getDisplayDate = (person: Person) => {
    // If the person has an originalDateFormat, use that
    if (person.originalDateFormat) {
      return person.originalDateFormat;
    }
    
    // Otherwise, convert the ISO date to a display date
    return toDisplayDateString(person.birthdate);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">People</h2>
        <Link to="/dashboard/people/new" className="btn btn-primary">
          Add Person
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium">Your People</h3>
            <p className="text-sm text-secondary">
              Manage the people you want to generate reports for.
            </p>
          </div>
          
          {people.length === 0 ? (
            <div className="p-6">
              <p className="text-center text-secondary py-8">
                You haven't added any people yet.
              </p>
              
              <div className="flex justify-center">
                <Link to="/dashboard/people/new" className="btn btn-outline">
                  Add Your First Person
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Birth Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {people.map((person) => (
                    <tr key={person.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {getDisplayDate(person)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {calculateAge(person.birthdate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={`/dashboard/reports/yearly/${person.id}`}
                            className="text-primary hover:text-primary-dark"
                          >
                            Yearly Report
                          </Link>
                          <Link 
                            to={`/dashboard/reports/life/${person.id}`}
                            className="text-primary hover:text-primary-dark"
                          >
                            Life Report
                          </Link>
                          <Link 
                            to={`/dashboard/people/${person.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Link>
                          {deleteConfirmId === person.id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDelete(person.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(person.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
