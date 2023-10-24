const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.products = [];
        this.nextId = 1;
        this.path = path;
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    async saveProducts() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    findProductByCode(code) {
        return this.products.find(product => product.code === code);
    }

    async getProducts() {
        await this.loadProducts();
        return this.products;
    }

    async getProductById(id) {
        await this.loadProducts();
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error(`No se encuentra ningún producto con ID:${id}`);
        }
        return product;
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || typeof product.stock !== "number") {
            throw new Error("Todos los campos son obligatorios");
        }

        if (this.findProductByCode(product.code)) {
            throw new Error("El código del producto ya existe");
        }

        const newProduct = {
            ...product,
            id: this.nextId++
        };

        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        await this.loadProducts();
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error(`No se encuentra ningún producto con ID:${id}`);
        }

        const updatedProduct = {
            ...this.products[productIndex],
            ...updatedFields
        };

        this.products[productIndex] = updatedProduct;
        await this.saveProducts();
        return updatedProduct;
    }

    async deleteProduct(id) {
        await this.loadProducts();
        const productIndex = this.products.findIndex(product => product.id === id); //Si findIndex no lo encuentra me devuelve -1
        if (productIndex === -1) {
            throw new Error(`No se encuentra ningún producto con ID:${id}`);
        }

        const deletedProduct = this.products.splice(productIndex, 1)[0];
        await this.saveProducts();
        return deletedProduct;
    }
}


module.exports = ProductManager;
