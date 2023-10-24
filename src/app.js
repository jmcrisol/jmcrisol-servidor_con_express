const express = require('express');
const ProductManager = require('./ProductManager.js');

const app = express();
const PORT = 8080;

const productManager = new ProductManager('./products.json');

app.use(express.json());

//Mensaje ruta raíz del servidor
app.get('/', (req, res) => {
    res.send('DESAFÍO ENTREGABLE - Servidor con express');
}); 



// Endpoint para '/products'
app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = req.query.limit && parseInt(req.query.limit);
        
        //verifico que sea un numero y que se haya solicitado el query
        if (isNaN(limit) && req.query.limit) { 
            return res.status(400).send({ error: "El límite proporcionado no es un número válido." });
        } 
        //verifico que el limit esté dentro de la cantidad de productos existentes
        if (limit > products.length) { 
            return res.status(400).send({ error: "El límite proporcionado excede la cantidad total de productos." });
        } 

        //Muestro segun el limite
        if (limit) {
            res.status(200).json({ products: products.slice(0, limit) }); 
        } 
        //Sin limite muestro todo
        else {
            res.status(200).json({ products }); 
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Endpoint para '/products/:pid'
app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid); //convierto el Id en entero

    // Verifico si productId es un número válido o NaN
    if (isNaN(productId)) {
       return res.status(400).send({ error: "El Id no es válido." });
    }

    try {
        const product = await productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).send({ error: error.message });
        } 
    }
});

app.listen(PORT, () => {
    console.log(`El servidor Express está escuchando en el puerto http://localhost:${PORT}`);
});


//Mensaje para cuelquier ruta erronea
app.use((req, res) => {
    res.status(404).send('Lo siento, no puedo encontrar lo que estás buscando.');
}); 