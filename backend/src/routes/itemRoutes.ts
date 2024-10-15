import { Router } from 'express';
import { getItems, addItem, editItem, deleteItem } from '../controllers/itemController';

const router = Router();

router.get('/', getItems);
router.post('/', addItem);
router.put('/:id', editItem);
router.delete('/:id', deleteItem);

export default router;