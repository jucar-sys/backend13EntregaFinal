import { Router } from "express";
import passport from "passport";
import prodModel from "../DAO/mongoManager/models/product.model.js";
import messModel from "../DAO/mongoManager/models/message.model.js";
import cartModel from "../DAO/mongoManager/models/cart.model.js";

const router = Router();

// Login
router.get('/', (req, res) => {
    // Si se está logueado pasar a la vista de productos
    if(req.session?.user) return res.redirect('/products');

    res.render('login', {});
});

// Github
router.get(
    '/login-github',
    passport.authenticate('github', {scope: ['user:email'] }),
    async(req, res) => {}
)

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/'}),
    async(req, res) => {
        req.session.user = req.user
        res.redirect('/products')
    }
)

// Register
router.get('/register', (req, res) => {
    // Si se está logueado pasar a la vista de productos
    if(req.session?.user) return res.redirect('/products');

    res.render('register', {});
});

// Midleware de inicio de sesion
function auth(req, res, next) {
    if(req.session?.user) return next();
    return res.redirect('/');
}
// Profile
router.get('/profile', auth, (req, res) => {
    // Obtenemos los datos del usuario
    const user = req.session.user;
    // Redirigimos al render de profile y pasamos los datos del usuari
    res.render('profile', user);
});

// Index - OK
router.get('/home', auth, async (req, res) => {
    // Traer la lista de productos de la DB
    const products  =  await prodModel.find().lean().exec();
    res.render('index', { products });
});

// Lista de productos - Realtime - OK
router.get('/realtimeproducts', auth, async (req, res) => {
    // Traer la lista de productos de la DB
    const products  =  await prodModel.find().lean().exec();
    res.render('realTimeProducts', { products });
});

// Eliminar Prod - OK
router.get('/delete/:id', auth, async (req, res) => {
    const id = req.params.id;

    await prodModel.deleteOne({ _id: id });
    return res.redirect('/products');
});

// Chat - OK
router.get('/chat', auth, async (req, res) => {
    // Traer lista de chat de la BD
    const chats  =  await messModel.find().lean().exec();
    res.render('chat', { chats });
});

// Products - OK
router.get('/products', auth, async (req, res) => {
    try {
        // Obtenemos los datos del usuario
        const user = req.session.user;
        // Tomamos el valores opcionales del query
        const page = parseInt(req.query?.page || 1);
        const limit = parseInt(req.query?.limit || 4);
        const sortParam = req.query?.sort || "price,asc"; // Formato: ?sort=prop,value
        let sort = {};
        const queryParams = req.query?.query || "status,true"; // Formato: ?query=prop,value
        let query = {}

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
        let products = await prodModel.paginate(query, {
            page,
            limit,
            sort,
            lean: true // Pasar a formato JSON
        });

        products.prevLink = products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${Object.keys(sort)[0]},${Object.values(sort)[0]}&query=${Object.keys(query)[0]},${Object.values(query)[0]}` : null;
        products.nextLink = products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${Object.keys(sort)[0]},${Object.values(sort)[0]}&query=${Object.keys(query)[0]},${Object.values(query)[0]}` : null;

        res.render('products', { status: "success", sort, query, products, user });
    } catch (e) {
        res.status(400).json({status: 'error', message: e.message});
    }
});

// Product detail - OK
router.get('/product/:pid', auth, async (req, res) => {
    const pid = req.params.pid;

    // Traer los detalles del producto de la BD
    const product  =  await prodModel.find({_id: pid}).lean().exec();
    res.render('product_detail', { product });
});

// Cart detail - OK
router.get('/cart/:cid', auth, async (req, res) => {
    const cid = req.params.cid;

    // Traer los detalles del producto de la BD
    const cart  =  await cartModel.findOne({_id: cid}).lean().exec();
    res.render('cart_detail', {idCart: cart._id, prods: cart.products });
});

export default router;