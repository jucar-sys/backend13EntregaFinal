import { Router } from "express";
import { ProductManager } from '../ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// Index
router.get('/', async (req, res) => {
    // Traer la lista de productos
    const products  =  await productManager.getProducts();
    res.render('index', { products });
});

// Formulario
router.get('/form-prods', async (req, res) => {
    res.render('form', {});
});

// Otener los datos del formulario y agregarlo a la lista de prods
router.post('/form-prods', async (req, res) => {
    const datos = req.body;

    if(datos.status === 'true'){
        datos.status = true;
    }
    if(datos.status === 'false'){
        datos.status = false;
    }
    console.log('Datos: ', datos);
    const resultado = await productManager.addProduct(datos.title, datos.description, datos.code, parseInt(datos.price), datos.status, parseInt(datos.stock), datos.category, datos.thumbnails);
    console.log('Resultado', resultado);
    res.redirect('/products');
});

// Lista de productos - Realtime
router.get('/realtimeproducts', async (req, res) => {
    // Traer la lista de productos
    const products  =  await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

export default router;