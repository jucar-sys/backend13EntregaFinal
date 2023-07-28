// Declaramos la variable socket
const socket = io();

// Tomamos data del form
document.getElementById("form1").onsubmit = e => {
    e.preventDefault();

    // Obtenemos los datos del form
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = parseInt(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);
    const category = document.getElementById("category").value;
    let status = document.getElementById("status").value;
    const thumbnails = document.getElementById("thumbnails").value;

     if(status === 'true'){
        status = true;
    }
    if(status === 'false'){
        status = true;
    }

    // Creamos el objeto producto
    const producto = {title, description, code, price, status, stock, category, thumbnails}

    // Emit
    socket.emit('newProduct', producto);
    Swal.fire(
        'Success',
        'Producto agregado',
        'success'
      );

      document.getElementById("form1").reset();
};

// Agregamos la data nueva al html
socket.on('recargar', data => {
    const ulProds = document.getElementById('ulProds');
    let products = [];

    // Creamos el array de productos
    data.forEach(product => {
        products += `<li class="list-group-item"><b>${product._id}</b> - ${product.title} - $${product.price} - <a class ="btn btn-danger py-0 px-2" href="/delete/${product._id}">Borrar</a></li>`;
    });

    // Pintamos el resultado en el HTML
    ulProds.innerHTML = products;
});