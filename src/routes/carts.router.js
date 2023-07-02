import { Router } from 'express';
import { CartsManager } from '../CartsManager.js';
import { ProductManager } from '../ProductManager.js';

const router = Router();

// Instancia a clases
const cartsManager = new CartsManager();
const productManager = new ProductManager();

// POST - Agregar nuevo carrito
router.post('/', async (req, res) => {
    try {
        // Agregamos el carrito
        await cartsManager.addCart();

        res.status(200).json({status: 'success', message: 'Carrito agregado con exito!!!'});
    } catch (e) {
        res.status(404).json({status: 'error', message: e.message});
    }
});

// GET - Listar los productos del carrito seleccionado
router.get('/:cid', async (req, res) => {
    try {
        // Parseamos el id obtenido como parametro
        let cid = parseInt(req.params.cid);
        const cartFound = await cartsManager.getCartById(cid);

        // Verificamos que el carrito exista
        if(!cartFound) throw {message: 'NOT FOUND: Carrito no encontrado'};

        // Si si existe lo retornamos
        res.status(200).json(cartFound.products);
    } catch (e) {
        res.status(404).json({status: 'error', message: e.message});
    }
});

// POST - Agregar producto al array de productos del carrito indicado
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        // Obtenemos los parametros del endpoint
        let cid = parseInt(req.params.cid);
        let pid = parseInt(req.params.pid);

        // variables para guardar el producto y el carrito
        let carritoFound = await cartsManager.getCartById(cid);
        let productFound = await productManager.getProductById(pid);

        // Validamos que exista el carrito
        if(!carritoFound) throw {message: 'NOT FOUND: carrito no encontrado'};

        // Validamos que exista el producto
        if(!productFound) throw {message: 'NOT FOUND: Producto no encontrado'};

        // Creamos el objeto producto para insertar en el carrito
        let objProd = {
            product: pid,
            quantity: parseInt(req.body.quantity)
        }

        // Enviar datos a la función encargada de agregar la info al carrito
        await cartsManager.addProductCart(objProd, carritoFound);

        res.status(200).json({status: 'success', message: `Carrito ${carritoFound.id} - Producto: ${productFound.id}`});
    } catch (e) {
        res.status(404).json({status: 'error', message: e.message});
    }
});

export default router;