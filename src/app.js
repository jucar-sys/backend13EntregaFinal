import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import __dirname from './utils.js';
import routerViews from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import prodModel from './DAO/mongoManager/models/product.model.js';
import messModel from './DAO/mongoManager/models/message.model.js';

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

// Corremos el server
mongoose.set('strictQuery', false);
const URL = 'mongodb+srv://JCBaits:SJHTYNpPXojPJP0S@ecommcluster1.yqzx7bs.mongodb.net/?retryWrites=true&w=majority';

// Conectamos a MongoDB
mongoose.connect(URL, {
    dbName: 'ecommerce'
}).then(() => {
    console.log('DB Connect Success');
}).catch(e => {
    console.log('Error: ' + e.message);
});

// Conexión
io.on('connect', socket => {
    console.log('Cliente conectado...');

    // Obtener la data del form para mostrarla en pantalla
    socket.on('newProduct', async data => {
        // Agregamos el producto a nuesta lista de productos
        if(data.status === 'true'){
            data.status = true;
        }
        if(data.status === 'false'){
            data.status = false;
        }
        data.price = parseInt(data.price);
        data.stock = parseInt(data.stock);
        console.log('data: ', data);

        const prodGenerated = new prodModel(data);
        await prodGenerated.save();

        // Obtenemos la lista actualizada
        const productos = await prodModel.find().lean().exec();

        // Emitimos el resultado
        io.emit('recargar', productos);
    });

    // Sockets para chat
    // Variable para los mensajes del chat
    socket.on('new', user => console.log(`${user} se acaba de conectar`));

    socket.on('message', async data => {
        const messages = await messModel.find().lean().exec();
        const messGenerated = new messModel(data);
        await messGenerated.save();
        messages.push(data);
        io.emit('logs', messages);
    });
});