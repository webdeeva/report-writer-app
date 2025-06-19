import asyncHandler from 'express-async-handler';
import { 
  getPeople, 
  getPersonById, 
  createPerson, 
  updatePerson, 
  deletePerson 
} from '../models/index.js';

/**
 * Convert MM/DD/YYYY to YYYY-MM-DD format using direct string manipulation
 * @param {string} dateStr - Date string in MM/DD/YYYY format
 * @returns {string} Date string in YYYY-MM-DD format
 */
const formatDateForStorage = (dateStr) => {
  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Convert MM/DD/YYYY to YYYY-MM-DD
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // If it's an ISO string with time, extract just the date part
  if (dateStr.includes('T')) {
    return dateStr.split('T')[0];
  }
  
  return dateStr;
};

/**
 * @desc    Get all people for the authenticated user
 * @route   GET /api/people
 * @access  Private
 */
const getPeopleList = asyncHandler(async (req, res) => {
  const people = await getPeople(req.user.id);
  res.json(people);
});

/**
 * @desc    Get a single person by ID
 * @route   GET /api/people/:id
 * @access  Private
 */
const getPersonDetails = asyncHandler(async (req, res) => {
  const personId = parseInt(req.params.id);
  const person = await getPersonById(personId);

  if (!person) {
    res.status(404);
    throw new Error('Person not found');
  }

  // Check if the person belongs to the authenticated user
  if (person.userId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this person');
  }

  res.json(person);
});

/**
 * @desc    Create a new person
 * @route   POST /api/people
 * @access  Private
 */
const createNewPerson = asyncHandler(async (req, res) => {
  const { name, birthdate, originalDateFormat } = req.body;

  if (!name || !birthdate) {
    res.status(400);
    throw new Error('Please provide name and birthdate');
  }

  // Convert birthdate to ISO format (YYYY-MM-DD) using direct string manipulation
  const isoDateString = formatDateForStorage(birthdate);

  // Validate birthdate format (YYYY-MM-DD)
  const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!birthdateRegex.test(isoDateString)) {
    res.status(400);
    throw new Error('Birthdate must be in YYYY-MM-DD format');
  }

  console.log('Creating person with birthdate:', isoDateString);
  console.log('Original date format:', originalDateFormat);

  const person = await createPerson({
    name,
    birthdate: isoDateString,
    originalDateFormat: originalDateFormat || null,
    userId: req.user.id
  });

  res.status(201).json(person);
});

/**
 * @desc    Update a person
 * @route   PUT /api/people/:id
 * @access  Private
 */
const updateExistingPerson = asyncHandler(async (req, res) => {
  const personId = parseInt(req.params.id);
  const { name, birthdate, originalDateFormat } = req.body;

  let isoDateString;
  
  // Convert birthdate to ISO format (YYYY-MM-DD) if provided
  if (birthdate) {
    isoDateString = formatDateForStorage(birthdate);
    
    // Validate birthdate format
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdateRegex.test(isoDateString)) {
      res.status(400);
      throw new Error('Birthdate must be in YYYY-MM-DD format');
    }
  }

  console.log('Updating person with birthdate:', isoDateString);
  console.log('Original date format:', originalDateFormat);

  const updatedPerson = await updatePerson(
    personId,
    { 
      name, 
      birthdate: isoDateString,
      originalDateFormat: originalDateFormat || null
    },
    req.user.id
  );

  if (!updatedPerson) {
    res.status(404);
    throw new Error('Person not found or not authorized to update');
  }

  res.json(updatedPerson);
});

/**
 * @desc    Delete a person
 * @route   DELETE /api/people/:id
 * @access  Private
 */
const deleteExistingPerson = asyncHandler(async (req, res) => {
  const personId = parseInt(req.params.id);

  try {
    const deleted = await deletePerson(personId, req.user.id);

    if (!deleted) {
      res.status(404);
      throw new Error('Person not found or not authorized to delete');
    }

    res.json({ message: 'Person deleted successfully' });
  } catch (error) {
    // Handle specific error for person used in reports
    if (error.message.includes('used in reports')) {
      res.status(400);
      throw error;
    }
    throw error;
  }
});

export {
  getPeopleList,
  getPersonDetails,
  createNewPerson,
  updateExistingPerson,
  deleteExistingPerson
};
