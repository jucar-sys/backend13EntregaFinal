import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Colleccion donde se crea el documento
const prodCollection = 'products';

// Creamos el modelo o esquema
const prodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnails: Array
});

// Agregamos el plugin de paginación al esquema
prodSchema.plugin(mongoosePaginate);

// Variable para exportar el modelo completo con sus configuraciones y plugins
const prodModel = mongoose.model(prodCollection, prodSchema);

export default prodModel;