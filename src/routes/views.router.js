import { Router } from "express";
import prodModel from "../DAO/mongoManager/models/product.model.js";
import messModel from "../DAO/mongoManager/models/message.model.js";

const router = Router();

// Index
router.get('/', async (req, res) => {
    // Traer la lista de productos de la DB
    const products  =  await prodModel.find().lean().exec();
    res.render('index', { products });
});

// Lista de productos - Realtime
router.get('/realtimeproducts', async (req, res) => {
    // Traer la lista de productos de la DB
    const products  =  await prodModel.find().lean().exec();
    res.render('realTimeProducts', { products });
});

// MONGO MANAGER
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;

    await prodModel.deleteOne({ _id: id });
    res.redirect('/');
});

// Chat
router.get('/chat', async (req, res) => {
    // Traer lista de chat de la BD
    const chats  =  await messModel.find().lean().exec();
    res.render('chat', { chats });
});

export default router;