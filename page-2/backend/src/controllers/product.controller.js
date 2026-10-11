import * as service from '../services/product.service.js';
export async function list(req,res,next){try{const data=await service.list();res.json({data,meta:{total:data.length}});}catch(e){next(e);}}
export async function detail(req,res,next){try{res.json({data:await service.detail(req.params.id),meta:{}});}catch(e){next(e);}}
export async function create(req,res,next){try{const data=await service.create(req.body);res.location(`/api/products/${data.id}`).status(201).json({data,meta:{}});}catch(e){next(e);}}
export async function replace(req,res,next){try{res.json({data:await service.replace(req.params.id,req.body),meta:{}});}catch(e){next(e);}}
export async function remove(req,res,next){try{await service.remove(req.params.id);res.status(204).end();}catch(e){next(e);}}
