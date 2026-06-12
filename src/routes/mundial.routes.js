import { Router } from 'express';
import {
  getInfo,
  getMundiales,
  getMundialBySlug,
  getCampeon,
  getRandom,
  searchMundiales,
} from '../controllers/mundial.controller.js';

const router = Router();

// GET /
router.get('/', getInfo);

// GET /mundiales  y  GET /mundiales?include=full
router.get('/mundiales', getMundiales);

// GET /mundial/:slug
router.get('/mundial/:slug', getMundialBySlug);

// GET /campeon/:pais
router.get('/campeon/:pais', getCampeon);

// GET /random
router.get('/random', getRandom);

// GET /search/:text
router.get('/search/:text', searchMundiales);

export default router;
