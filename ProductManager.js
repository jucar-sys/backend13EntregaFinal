// Desafio 2 03/06/23

// Importamos la libreria fs
const fs = require('fs');

class ProductManager {
    // Método constructor
    constructor() {
        this.path = 'productos.json';
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

        // Some retorna true si encuentra al meno un resultado que coincida con la busqueda
        let buscar = values.some(value => !value); // Retorna falso si encuentra al gun valor "", null, undefined o 0. Por eso lo negamos con !
        // Retornamos el valor de la busqueda
        return buscar;
    }

    // Método para agregar un nuevo producto
    addProduct = async (title, description, price, thumbnail, code, stock, id) => {

        // Si ID contine algo lo dejamos tal cual y si nón le asignamos el valor aleatorio
        if(id === undefined || id === null || id === '') id = Math.floor((Math.random() * (9999 - 1 + 1)) + 1);

        // Agregamos los datos recibidos a un objeto
        const product = {
                    id: id,
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock
                }
        // Obtenemos la lista de los productos guardados en el archivo si es que existe
        const listaProductos = await this.getProducts();

        // Validamos code
        const validarCode = await this.validarCode(product, listaProductos);
        // Validamos campos
        const validarCampos = await this.validarCampos(product);
        if(validarCode){
            console.log("\n..:: WARNING: No puede haber dos productos con el mismo código. ::..\nPRODUCTO NO AGREGADO");
        }else{
            if(validarCampos){
                console.log("\n..:: WARNING: No puede haber productos con campos vacios ::..\nPRODUCTO NO AGREGADO\n");
            } else {
                // Agregar el objeto a la lista de productos
                listaProductos.push(product);

                // Creamos el archivo de la lista de productos
                await fs.promises.writeFile(this.path, JSON.stringify(listaProductos));
                console.log("PRODUCTO AGREGADO");
            }
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
                            PRECIO - $${producto.price}.00
                            URL IMAGEN - ${producto.thumbnail}
                            CÓDIGO - ${producto.code}
                            STOCK - ${producto.stock}
                            `);
            return producto;
        }else {
            console.log('NOT FOUND: Producto no encontrado');
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
            return [];
        }
    }

    // Método para actualizar productos
    updateProduct = async(obj) => {
        // Obtenemos la lista de productos actuales
        const productos = await this.getProducts();

        // Validamos si productos contiene algun elemento si no para terminar la busqueda
        if(productos.length === 0) return console.log('ERROR: Lista de productos vacia');

        // Variable para guardar el resultado true o false de la busqueda
        let buscar;

        // Buscamos el producto con el id del objeto utilizando find para que nos devuelva el objeto producto en caso de existir
        const resultado = productos.find(prod => {
            buscar = prod.id === obj.id;
            return buscar;
        });

        // Validamos si existe o no el producto buscado
        if(!resultado) return console.log('ERROR: El producto a actualizar no existe.');

        // Eliminamos el producto a actualizar
        await this.deleteProduct(resultado.id);

        // Agregamos a la lista el producto actualizado
        await this.addProduct(obj.title, obj.description, obj.price, obj.thumbnail, obj.code, obj.stock, obj.id);
    }

    // Método para eliminar un producto de la lista de productos
    deleteProduct = async(id) => {
        const productos = await this.getProducts();

        // Creamos un array que no contenga el id que se eliminará
        const resultado = productos.filter(item => item.id != id);

        if(resultado.length === productos.length) return console.log('ERROR: El producto a eliminar no existe...');

        await fs.promises.writeFile(this.path, JSON.stringify(resultado));
        console.log('Elemento eliminado');
    }
}

/////////////////////////////////////////////////////////////////////////////////////////

/* TESTING */
async function ejecutar(){
    // Creamos instancia de la clase productManager
    const productMng = new ProductManager();
    console.log('LISTA DE PRODUCTOS:', await productMng.getProducts());

    // // Creamos varios productos (Todos sin errores)
    // await productMng.addProduct('Papas saladas 250gr', 'Papas fritas saladas caseras de 250gr', 17, './ruta/imgs/img1.jpg', 'papsal250', 12);
    // await productMng.addProduct('Refresco de naranja 600ml', 'Refresco sabor naranja de 600ml', 15, './ruta/imgs/img2.jpg', 'refnar600', 10);
    // await productMng.addProduct('Kinder Delice 100gr', 'Chocolate Kinder Delice 100gr', 20, './ruta/imgs/img3.jpg', 'chockide100', 25);

    // // Producto con error de CODE
    // await productMng.addProduct('Kinder Bueno 100gr', 'Chocolate Kinder Bueno 100gr', 20, './ruta/imgs/img4.jpg', 'papsal250', 15); // CODE Repetido

    // // Productos con error de CAMPOS
    // await productMng.addProduct('Kilo de huevo', '', 45, './ruta/imgs/img5.jpg', 'huevo1kg', 10); // Campo vacio
    // await productMng.addProduct('Medio Kg de huevo', 'Medio Kilogramo de huevo blanco', 27, './ruta/imgs/img6.jpg', 'huevo1/2kg'); // Campos incompletos

    // // Otros productos sin errores
    // await productMng.addProduct('Papas enchiladas 250gr', 'Papas fritas enchiladas caseras de 250gr', 17, './ruta/imgs/img7.jpg', 'papench250', 18);
    // await productMng.addProduct('Paleta payaso 100gr', 'Paleta de choclate paleta Payaso 100gr', 10, './ruta/imgs/img8.jpg', 'palpay100gr', 10);

    // // Buscar Producto por ID
    // await productMng.getProductById(3033);

    // // Actualizamos un producto
    // await productMng.updateProduct({
    //     id: 3,
    //     title: 'Paleta2',
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