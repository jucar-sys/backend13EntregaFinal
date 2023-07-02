import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const port = 8080;
// Codigo para que nuestra api reconozca el formato JSON y no tenga errores
app.use(express.json());
// Ruta estática
app.use('/static', express.static('./src/public'));

// Ruta productos
app.use('/api/products', productsRouter);
//Ruta de carts
app.use('/api/carts', cartsRouter);

// Escuchar el servidor
app.listen(port, () => {
    console.log(`Conectado en el puerto ${port}...`);
});