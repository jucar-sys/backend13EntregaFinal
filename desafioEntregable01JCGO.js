// Desafio 1 27/05/23
class ProductManager {
    // Método constructor
    constructor() {
        // Elemento products para guardar la lista de produtos
        this.products = [];
    }

    static idAutoincrementable = 1;

    //Validar que no exista producto con el mismo code
    validarCode(producto){
        let buscar;
        let validarCode = this.products.find(prod => {
            buscar = prod.code === producto.code;
            return buscar;
        });
        return buscar;
    }

    // Validar que todos los campos sean obligatorios
    validarCampos(producto) {
        // Obtener los valores de objeto producto
        const values = Object.values(producto);

        let buscar;
        let validarCampos = values.find(val => {
            buscar = val === '' || val === null || val === undefined;
            return buscar;
        });

        // Si algún campo está vacío retornar true
        if(buscar) return true;
        // Si todos los campos estan llenos retornar False
        return false;
    }

    // Método para agregar un nuevo producto
    addProduct(title, description, price, thumbnail, code, stock) {
        // Agregamos los datos recibidos a un objeto
        const product = {
                    id: ProductManager.idAutoincrementable++,
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock
                }

        // Validamos code
        const validarCode = this.validarCode(product);
        // Validamos campos
        const validarCampos = this.validarCampos(product);
        if(validarCode){
            console.log("\n..:: WARNING: No puede haber dos productos con el mismo código. ::..\nPRODUCTO NO AGREGADO");
        }else{
            if(validarCampos){
                console.log("\n..:: WARNING: No puede haber productos con campos vacios ::..\nPRODUCTO NO AGREGADO\n");
            } else {
                // Agregar el objeto a la lista de productos
                this.products.push(product);
            }
        }
    }

    // Obtener producto por id
    getProductById(id){
        let buscar;
        let producto = this.products.find(prod => {
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
    getProducts(){
        return this.products;
    }

}

/////////////////////////////////////////////////////////////////////////////////////////

/* TESTING */
// Creamos instancia de la clase productManager
const productMng = new ProductManager();
console.log('LISTA DE PRODUCTOS:', productMng.getProducts());

// Creamos varios productos (Todos sin errores)
productMng.addProduct('Papas saladas 250gr', 'Papas fritas saladas caseras de 250gr', 17, './ruta/imgs/img1.jpg', 'papsal250', 12);
productMng.addProduct('Refresco de naranja 600ml', 'Refresco sabor naranja de 600ml', 15, './ruta/imgs/img2.jpg', 'refnar600', 10);
productMng.addProduct('Kinder Delice 100gr', 'Chocolate Kinder Delice 100gr', 20, './ruta/imgs/img3.jpg', 'chockide100', 25);

// Producto con error de CODE
productMng.addProduct('Kinder Bueno 100gr', 'Chocolate Kinder Bueno 100gr', 20, './ruta/imgs/img4.jpg', 'chockide100', 15); // CODE Repetido

// Productos con error de CAMPOS
productMng.addProduct('Kilo de huevo', '', 45, './ruta/imgs/img5.jpg', 'huevo1kg', 10); // Campo vacio
productMng.addProduct('Medio Kg de huevo', 'Medio Kilogramo de huevo blanco', 27, './ruta/imgs/img6.jpg', 'huevo1/2kg'); // Campos incompletos

// Otros productos sin errores
productMng.addProduct('Papas enchiladas 250gr', 'Papas fritas enchiladas caseras de 250gr', 17, './ruta/imgs/img7.jpg', 'papench250', 18);
productMng.addProduct('Paleta payaso 100gr', 'Paleta de choclate paleta Payaso 100gr', 10, './ruta/imgs/img8.jpg', 'palpay100gr', 10);

// Buscar Producto por ID
productMng.getProductById(2);

// Imprimimos en pantalla array de objetos de productos
console.log('LISTA DE PRODUCTOS:', productMng.getProducts());