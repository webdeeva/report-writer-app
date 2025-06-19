import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getPeopleList, 
  getPersonDetails, 
  createNewPerson, 
  updateExistingPerson, 
  deleteExistingPerson 
} from '../controllers/peopleController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all people
router.get('/', getPeopleList);

// Get single person
router.get('/:id', getPersonDetails);

// Create person
router.post('/', createNewPerson);

// Update person
router.put('/:id', updateExistingPerson);

// Delete person
router.delete('/:id', deleteExistingPerson);

export default router;
