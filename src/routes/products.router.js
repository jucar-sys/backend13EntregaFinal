import { Router } from 'express';
import prodModel from "../DAO/mongoManager/models/product.model.js";

const router = Router();

// GET - Obtener productos - Limit o lista completa
// Limit - OK
// Page - OK
// Query - TODO: Falta
// Sort - TODO: Falta
// Formato de objeto - OK
// Busqueda y ordenamiento - TODO: Falta
router.get('/', async (req, res) => {
    try {
        // let productos = await prodModel.find().lean().exec();
        // Tomamos el valores opcionales del query
        // const query = req.query?.query || "";
        // console.log(query);
        const page = parseInt(req.query?.page || 1);
        const limit = parseInt(req.query?.limit || 10);

        // Validamos que limit sea mayor a 0 y menor a 11
        if(limit < 1 || limit > 10) throw {message: `NOT FOUND: El valor de limit debe ser mayor a 0 y menor que 11`};

        let result = await prodModel.paginate({}, {
            page,
            limit,
            lean: true // Pasar a formato JSON
        });

        result.prevLink = result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null;
        result.nextLink = result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null;

        console.log(result);

        return res.status(200).json({status: "success", result});
        // res.render('users', result)

        // Mostramos solo la cantidad de elementos deseados
        // return res.status(200).json(productos.slice(0, limit));
    } catch (e) {
        res.status(400).json({status: 'error', message: e.message});
    }
});

// GET - Obtener producto según ID
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

// POST - Agregar nuevo producto
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
    } catch (error) {
        res.status(404).json({status: 'error', message: e.message});
    }
});

// TODO: Revisar como actualizar docuemnto en Mongo
// PUT - Actualizar un producto sin cambiar el id
router.put('/:pid', async (req, res) => {
    try {
        // Tomar el id pasado como parametro y lo parseamos
        const pid = parseInt(req.params.pid);
        // Tomamos los datos a actualizar del objeto obtenido por parametro
        const product = req.body;

        // Actualizamos el producto
        // await productsManager.updateProduct(product, pid); // File manager
        // await productsManager.updateProduct(product, pid);

        res.status(200).json({status: 'success', message: 'Producto actualizado en exito!!!'});
    } catch (e) {
        res.status(404).json({status: 'error', message: e.message});
    }
});

// DELETE - Eliminar producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        // Tomar el id pasado como parametro y lo parseamos
        const pid = req.params.pid;

        if(!await prodModel.deleteOne({_id: ObjectId(pid)})) throw {message: 'NOT FOUND'}

        res.status(200).json({status: 'success', message: 'Producto eliminado en exito!!!'});
    } catch (e) {
        res.status(404).json({status: 'error', message: e.message});
    }
});

export default router;