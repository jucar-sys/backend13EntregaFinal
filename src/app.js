import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import { ProductManager } from './ProductManager.js';
import routerViews from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const port = 8080;

// Configurar socket
const httpServer = app.listen(port, () => console.log('Listening...'));
const io = new Server(httpServer);

// Codigo para que nuestra api reconozca el formato JSON y no tenga errores
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuraciones de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Ruta estática
app.use('/static', express.static(__dirname + '/public'));

// Rutas
app.get(('/health', (req, res) => {res.send('OK')}));
app.use('/', routerViews);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Instanciamos la clase
const productManager = new ProductManager();

// Conexión
io.on('connect', socket => {
    console.log('Cliente conectado...');
    // Obtener la data del form
    socket.on('newProduct', async data => {
        // Agregamos el producto a nuesta lista de productos
        const resultado = await productManager.addProduct(data.title, data.description, data.code, parseInt(data.price), data.status, parseInt(data.stock), data.category, data.thumbnails)
        console.log(resultado);

        // Obtenemos la lista actualizada
        const productos = await productManager.getProducts();

        // Emitimos el resultado
        io.emit('recargar', productos);
    });
});