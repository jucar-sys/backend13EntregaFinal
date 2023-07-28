// Importamos la libreria fs
import fs from 'fs';

export class CartsManager {
    // Método constructor
    constructor() {
        this.path = './src/carrito.json';
    }

    // Método para agregar un nuevo producto
    addCart = async () => {
        try {
            // Creamos la estructura del carrito
            const cart = {
                        id: Math.floor((Math.random() * (9999 - 1 + 1)) + 1),
                        products: []
                    }

            // Obtenemos la lista de los carritos guardados en el archivo si es que existe
            const listaCarritos = await this.getAllCarts();
            // Agregamos el carrito nuevo
            listaCarritos.push(cart);

            // Creamos el carrito
            await fs.promises.writeFile(this.path, JSON.stringify(listaCarritos));
            console.log("CARRITO AGREGADO");

        } catch (e) {
            console.log(`Error al agregar carrito: ${e.message}`);
        }

    }

    addProductCart = async (objProd, carrito) => {
        try {
            const id = carrito.id;
            let objCarrito = carrito;

            if(carrito.products.length === 0) {
                objCarrito.products.push(objProd);
            } else {
                carrito.products.map(product => {
                    if(product.product === objProd.product) {
                        objProd.quantity += product.quantity;
                        return {
                            ...product,
                            ...objProd
                        }
                    } else {
                        return objProd;
                    }
                });
            }

            objCarrito = {
                id: id,
                products: [objProd]
            }

            await this.updateCart(objCarrito);

            console.log("PRODUCTO AGREGADO");
        } catch (e) {
            console.log(`Error al agregar producto: ${e.message}`);
        }

    }

    // Obtener carrito por id
    getCartById = async(id) => {
        // Obtenemos la lista de los productos guardados en el archivo si es que existe
        const listaCarritos = await this.getAllCarts();
        let buscar;
        let carrito = listaCarritos.find(cart => {
            buscar = cart.id === id;
            return buscar;
        });

        if(buscar){
            console.log(`-> CARRITO ENCONTRADO:
                            ID - ${carrito.id}
                            PRODUCTOS - ${carrito.products}
                            `);
            return carrito;
        }else {
            console.log('NOT FOUND: Carrito no encontrado');
            return null;
        }
    }

    // Obtener todos los productos
    getAllCarts = async() => {
        if(fs.existsSync(this.path)){
            // Si el archivo existe lo llenamos y guardamos la lista de productos ya parseado
            const resultado = await fs.promises.readFile(this.path, 'utf-8')
                .then((res) => JSON.parse(res))

            // Retornar el objeto con los productos
            return resultado;
        } else {
            console.log('No hay carritos');
            return [];
        }
    }

    // Método para actualizar carrito
    updateCart = async(obj) => {
        try {
            // Obtenemos la lista de carritos actuales
            let carritos = await this.getAllCarts();

            // Validamos si carritos contiene algun elemento si no para terminar la busqueda
            if(carritos.length === 0) throw {message: 'ERROR: Lista de carritos vacia'}

            // En caso de que exista el carrito lo combinamos
            await fs.promises.writeFile(this.path, JSON.stringify(carritos = carritos.map(carrito => {
                if(carrito.id === obj.id){
                    console.log(`Success act1`);
                    return {
                        ...carrito,
                        ...obj
                    }
                }
                return carrito;
            })));
        } catch (e) {
            console.log(`Ocurrio un error al actualizar el carrito: ${e.message}`);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////