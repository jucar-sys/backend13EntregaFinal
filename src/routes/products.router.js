import { Router } from 'express';
import prodModel from "../DAO/mongoManager/models/product.model.js";

const router = Router();

// GET - Obtener productos - Limit o lista completa
router.get('/', async (req, res) => {
    try {
        let productos = await prodModel.find().lean().exec();
        // Tomamos el valor del query limit
        const limit = req.query.limit;

        // Si el query limit no existe retornar la lista de productos completa
        if(!limit) return res.status(200).json(productos);

        // Validamos que limit sea mayor a 0 y menor a 11
        if(limit < 1 || limit > 10) throw {message: `NOT FOUND: El valor de limit debe ser mayor a 0 y menor que 11`};

        // Mostramos solo la cantidad de elementos deseados
        return res.status(200).json(productos.slice(0, limit));
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

// FILE MANAGER
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