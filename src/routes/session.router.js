import { Router } from 'express';
import userModel from '../DAO/mongoManager/models/user.model.js';
// import session from 'express-session';

const router = Router();

// Lógica para autenticar desde el login
router.post('/login', async (req, res) => {
    try {
        const admin = {
            first_name: 'Admin',
            last_name: 'Coder',
            age: 999,
            email: 'adminCoder@coder.com',
            password: 'adminCod3r123',
            rol: 'admin'
        };
        // Tomamos los datos del body que se pasaron por el fomulario de login
        const {email, password} = req.body;

        if(email === admin.email && password === admin.password) {
            req.session.user = admin;
            return res.redirect('/products');
        }

        // Buscamos al usuario en la DB
        const user = await userModel.findOne({email, password});

        // Si el usuario no existe regresar al login
        if(!user) throw {message: `NOT FOUND: El usuario no existe`};

        // Guardamos los datos del usuario logueado en la sesion activa
        req.session.user = user;

        return res.redirect('/products');
    } catch (e) {
        console.log({status: 'error', message: e.message});
        return res.redirect('/');
    }
});

// Lógica para realizar el registro
router.post('/register', async (req, res) => {
    try {
        // Tomamos los datos del usuario registrado
        const user = req.body;

        if(user.password != user.password2) throw {message: `NOT FOUND: Contraseñas diferentes`};

        // Creamos el usuario en mongo
        if(!await userModel.create(user)) throw {message: `NOT FOUND: Error al crear el usuario`};

        // Redirigimos al login
        return res.redirect('/');
    } catch (e) {
        console.log({status: 'error', message: e.message});
        return res.redirect('/');
    }
});

// Lógica para destruirla sesion LOGOUT
router.get('/logout', async (req, res) => {
    try {
        // Intentamos destruir la sesion
        const result = req.session.destroy();

        if(!result) throw {message: `ERROR: No se pudo destruir la sesion`};

        // Redirigimos al login
        return res.redirect('/');
    } catch (e) {
        console.log({status: 'error', message: e.message});
        return res.redirect('/');
    }
});

export default router;