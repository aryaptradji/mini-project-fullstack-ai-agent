import { Router } from 'express';
import * as c from '../controllers/product.controller.js';
const router=Router(); router.get('/',c.list);router.get('/:id',c.detail);router.post('/',c.create);router.put('/:id',c.replace);router.delete('/:id',c.remove);export default router;
