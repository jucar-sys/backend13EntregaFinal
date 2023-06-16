import express from 'express';
import { ProductManager } from './ProductManager.js';

const app = express();
const port = 8080;
// Codigo para que nuestra api reconozca el formato JSON y no tenga errores
app.use(express.json());

// Instancia a clase ProductManager
const productsManager = new ProductManager();
let productos = await productsManager.getProducts();

// GET - Obtener productos - Limit o lista completa
app.get('/products', async (req, res) => {
    try {
        // Tomamos el valor del query limit
        const limit = req.query.limit;

        // Si el query limit no existe retornar la lista de productos completa
        if(!limit) return res.status(200).json(productos);

        // Validamos que limit sea mayor a 0 y menor a 11
        if(limit < 1 || limit > 10) return res.status(406).json({status: 'error', message: `NOT FOUND: El valor de limit debe ser mayor a 0 y menor que 11`});

        // Mostramos solo la cantidad de elementos deseados
        return res.status(200).json(productos.slice(0, limit));
    } catch (e) {
        res.status(404).json({status: 'error', message: `NOT FOUND: ${e.message}`});
    }
});

// GET - Obtener producto según ID
app.get('/products/:pid', async (req, res) => {
    try {
        // Parseamos el id obtenido por params
        let pid = parseInt(req.params.pid);

        // Verificamos que el producto exista
        if(await productsManager.getProductById(pid)) return res.status(200).json(await productsManager.getProductById(pid));

        return res.status(404).json({status: 'error', message: 'NOT FOUND: Producto no encontrado'});
    } catch (e) {
        res.status(404).json({status: 'error', message: `NOT FOUND: ${e.message}`});
    }
});

// Escuchar el servidor
app.listen(port, () => {
    console.log(`Conectado en puerto ${port}...`);
});