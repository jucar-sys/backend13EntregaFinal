// Importamos la libreria fs
import fs from 'fs';

export class ProductManager {
    // Método constructor
    constructor() {
        this.path = './src/productos.json';
    }

    //Validar que no exista producto con el mismo code
    validarCode = async(producto, listaProductos) => {
        // Some para retornar true o false si existe el elemento buscado
        let buscar = listaProductos.some(prod => prod.code === producto.code);

        return buscar;
    }

    // Validar que todos los campos sean obligatorios
    validarCampos = async(producto) => {
        // Obtener los valores de objeto producto
        const values = Object.values(producto);

        // Some retorna true si encuentra al menos un resultado que coincida con la busqueda
        let buscar = values.some(value => !value); // Retorna falso si encuentra algun valor "", null, undefined o 0. Por eso lo negamos con !

        // Retornamos el valor de la busqueda
        return buscar;
    }

    // Método para agregar un nuevo producto
    addProduct = async (title, description, code, price, status, stock, category, ruta) => {
        try {
            // Agregamos los datos recibidos a un objeto
            const product = {
                        id: Math.floor((Math.random() * (9999 - 1 + 1)) + 1),
                        title: title,
                        description: description,
                        code: code,
                        price: price,
                        status: status,
                        stock: stock,
                        category: category,
                        thumbnails: ruta
                    }

            // Desestructuramos el objeto product para validar campos excluyendo la propiedad thumbnail
            const {thumbnails, ...objProd} = product;

            // Obtenemos la lista de los productos guardados en el archivo si es que existe
            const listaProductos = await this.getProducts();

            // Validamos code
            const validarCode = await this.validarCode(product, listaProductos);

            // Validamos campos
            const validarCampos = await this.validarCampos(objProd);

            if(validarCode) throw {message: "\n..:: WARNING: No puede haber dos productos con el mismo código. ::..\nPRODUCTO NO AGREGADO"}

            if(validarCampos) throw {message: "\n..:: WARNING: No puede haber productos con campos vacios ::..\nPRODUCTO NO AGREGADO\n"};
            // Agregar el objeto a la lista de productos
            listaProductos.push(product);

            // Creamos el archivo de la lista de productos
            await fs.promises.writeFile(this.path, JSON.stringify(listaProductos));
            console.log("PRODUCTO AGREGADO");

        } catch (e) {
            console.log(`Error al agregar producto: ${e.message}`);
        }

    }

    // Obtener producto por id
    getProductById = async(id) => {
        // Obtenemos la lista de los productos guardados en el archivo si es que existe
        const listaProductos = await this.getProducts();
        let buscar;
        let producto = listaProductos.find(prod => {
            buscar = prod.id === id;
            return buscar;
        });

        if(buscar){
            console.log(`-> PRODUCTO ENCONTRADO:
                            ID - ${producto.id}
                            NOMBRE - ${producto.title}
                            DESCRIPCIÓN - ${producto.description}
                            CÓDIGO - ${producto.code}
                            PRECIO - $${producto.price}.00
                            STATUS - ${producto.status}
                            STOCK - ${producto.stock}
                            CATEGORY - ${producto.category}
                            IMÁGENES - ${producto.thumbnails}
                            `);
            return producto;
        }else {
            console.log('NOT FOUND: Producto no encontrado');
            return null;
        }
    }

    // Obtener todos los productos
    getProducts = async() => {
        if(fs.existsSync(this.path)){
            // Si el archivo existe lo llemos y guardamos la lista de productos ya parseado
            const resultado = await fs.promises.readFile(this.path, 'utf-8')
                .then((res) => JSON.parse(res))

            // Retornar el objeto con los productos
            return resultado;
        } else {
            console.log('No hay productos');
            return [];
        }
    }

    // Método para actualizar productos
    updateProduct = async(obj, id) => {
        try {
            // Obtenemos la lista de productos actuales
            let productos = await this.getProducts();

            // Validamos si productos contiene algun elemento si no para terminar la busqueda
            if(productos.length === 0) throw {message: 'ERROR: Lista de productos vacia'}

            // En caso de que coincida el id, se combinan las propiedades de los objetos
            await fs.promises.writeFile(this.path, JSON.stringify(productos = productos.map(producto => {
                if(producto.id === id){
                    console.log(`SUCCESS: Producto con id ${id} actualizado`);
                    return {
                        ...producto,
                        ...obj
                        };
                }
                return producto;
            })
            ));
        } catch (e) {
            console.log(`Ocurrio un error al actualizar el producto: ${e.message}`);
        }
    }

    // Método para eliminar un producto de la lista de productos
    deleteProduct = async(id) => {
        try {
            const productos = await this.getProducts();
            // Creamos un array que no contenga el id que se eliminará
            const resultado = productos.filter(item => item.id != id);

            if(resultado.length === productos.length) throw {message: 'ERROR: El producto a eliminar no existe...'};

            await fs.promises.writeFile(this.path, JSON.stringify(resultado));
            return true;
        } catch (e) {
            console.log(`Ocurrio un error al eliminar el producto: ${e.message}`);
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////

/* TESTING */
async function ejecutar(){
    // // Creamos instancia de la clase productManager
    // const productMng = new ProductManager();
    // console.log('LISTA DE PRODUCTOS:', await productMng.getProducts());

    // // Producto sin errores
    // await productMng.addProduct('Papas saladas 250gr', 'Papas fritas saladas caseras de 250gr', 17, './ruta/imgs/img1.jpg', 'papsal250', 12);

    // // Producto con error de CODE
    // await productMng.addProduct('Kinder Bueno 100gr', 'Chocolate Kinder Bueno 100gr', 20, './ruta/imgs/img4.jpg', 'papsal250', 15); // CODE Repetido

    // // Producto con error de CAMPOS
    // await productMng.addProduct('Kilo de huevo', '', 45, './ruta/imgs/img5.jpg', 'huevo1kg', 10); // Campo vacio

    // Buscar Producto por ID
    // await productMng.getProductById(6051);

    // Actualizamos un producto
    // await productMng.updateProduct({
    //     id: 448,
    //     title: 'Paleta12454',
    //     description: 'Paleta',
    //     price: 8,
    //     thumbnail: './ruta/imgs/img10.jpg',
    //     code: '123456lkj',
    //     stock: 100
    // });

    // //Eliminamos un producto
    // await productMng.deleteProduct(6945);
}

ejecutar();