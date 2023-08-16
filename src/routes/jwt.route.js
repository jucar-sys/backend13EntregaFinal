import { Router } from 'express';
import { generateToken, authToken } from '../utils.js';

const usersDB = [];
const router = Router();

router.post('/register', (req, res) => {
    const user = req.body;

    if (usersDB.find(u => u.email === user.email)) {
        return res.status(400).send('User already exist');
    }

    usersDB.push(user);
    const access_token = generateToken(user);

    res.send({status: 'success', access_token})
});

// Se valida con el middleware del utils del jwt
router.get('/current', authToken, (req, res) => {
    res.send({status: 'success', payload: req.user});
});

export default router;