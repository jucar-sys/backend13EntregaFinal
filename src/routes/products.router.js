import { Router } from 'express';
import prodModel from "../DAO/mongoManager/models/product.model.js";

const router = Router();

// GET - Obtener productos - Limit o lista completa y con filtros y paginate
// Limit - OK
// Page - OK
// Query - OK
// Sort - OK
// Formato de objeto - OK
// Busqueda y ordenamiento - TODO: Falta
router.get('/', async (req, res) => {
    try {
        // Tomamos el valores opcionales del query
        const page = parseInt(req.query?.page || 1);
        const limit = parseInt(req.query?.limit || 10);
        const sortParam = req.query?.sort || ""; // Formato: ?sort=prop,value
        const sort = {};
        const queryParams = req.query?.query || ""; // Formato: ?query=prop,value
        const query = {}

        // Validamos que limit sea mayor a 0 y menor a 11
        if(limit < 1 || limit > 10) throw {message: `NOT FOUND: El valor de limit debe ser mayor a 0 y menor que 11`};

        // Validamos el formato del valor del query sort
        // Funcionará con asc, des, 1 y -1 para cualquier propiedad
        if(sortParam){
            const prop = sortParam.split(',')[0];
            let value = sortParam.split(',')[1];

            // Validamos el param y lo convertimos al formato deseado
            if(!isNaN(parseInt(value))){
                value = parseInt(value);
            } else if(value === "desc"){
                value = -1
            } else if(value === "asc"){
                value = 1
            }

            sort[prop] = value;
        }

        // Validamos el formato del valor del query param
        if(queryParams){
            const prop = queryParams.split(',')[0];
            let value = queryParams.split(',')[1];

            if(!isNaN(parseInt(value))) value = parseInt(value)

            query[prop] = value;
        }

        // Hacemos el paginate
        let result = await prodModel.paginate(query, {
            page,
            limit,
            sort,
            lean: true // Pasar a formato JSON
        });

        result.prevLink = result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null;
        result.nextLink = result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null;

        return res.status(200).json({status: "success", result});
    } catch (e) {
        res.status(400).json({status: 'error', message: e.message});
    }
});

// GET - Obtener producto según ID - OK
router.get('/:pid', async (req, res) => {
    try {
        // Parseamos el id obtenido por params
        let pid = req.params.pid;
        // Metemos en una constante la consulta para no duplicar el codigo
        const productFound = await prodModel.findById(pid);

        // Verificamos que el producto exista
        if(!productFound) throw {message: 'NOT FOUND: Producto no encontrado'}

        // Si existe lo retornamos
        res.status(200).json(productFound);
    } catch (e) {
        res.status(404).json({status: 'error', message: e.message});
    }
});

// POST - Agregar nuevo producto - OK
router.post('/', async (req, res) => {
    try {
        // Tomamos el objeto pasado por medio del body
        let product = req.body;

        // Agregamos el producto
        if(product.status === 'true'){
            product.status = true;
        }
        if(product.status === 'false'){
            product.status = false;
        }
        product.price = parseInt(product.price);
        product.stock = parseInt(product.stock);
        console.log('product: ', product);

        const prodGenerated = new prodModel(product);
        await prodGenerated.save();

        res.status(200).json({status: 'success', message: 'Producto agregado con exito!!!'});
    } catch (e) {
        res.status(404).json({status: 'error', message: e.message});
    }
});

// PUT - Actualizar un producto sin cambiar el id - OK
router.put('/:pid', async (req, res) => {
    try {
        // Tomar el id pasado como parametro y lo parseamos
        const pid = req.params.pid;
        // Tomamos los datos a actualizar del objeto obtenido por parametro
        const product = req.body;

        // Actualizamos el producto
        if(!await prodModel.updateOne({_id: {$eq: pid}}, {$set: product})) throw {message: 'NOT FOUND'};

        res.status(200).json({status: 'success', message: 'Producto actualizado en exito!!!'});
    } catch (e) {
        res.status(404).json({status: 'error', message: e.message});
    }
});

// DELETE - Eliminar producto por ID - OK
router.delete('/:pid', async (req, res) => {
    try {
        // Tomar el id pasado como parametro y lo parseamos
        const pid = req.params.pid;

        if(!await prodModel.deleteOne({_id: pid})) throw {message: 'NOT FOUND'}

        res.status(200).json({status: 'success', message: 'Producto eliminado en exito!!!'});
    } catch (e) {
        res.status(404).json({status: 'error', message: e.message});
    }
});

export default router;