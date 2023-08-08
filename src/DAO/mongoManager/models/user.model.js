import mongoose from "mongoose";

// Coleccion donde se crea el documento de usuarios
const userCollection = 'users';

// Modelo o Schema de los usuarios
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    }
});

// Variable para exportar el modelo con sus configuraciones
const userModel = mongoose.model(userCollection, userSchema);

export default userModel;