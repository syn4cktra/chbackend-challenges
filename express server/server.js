const express = require('express')
const app = express()
const ProductManager = require('./ProductManager.js');
const productManager = new ProductManager('./data.json');
const port = 3000

app.use(express.json()) 
app.use(express.urlencoded({extended:true}))

app.get('/products', async (req, res) => {
    let limit = req.query?.limit
    try {
        let products = await productManager.getProducts(limit)
        if(products) {
            res.status(200).json(products)
        }else{
            res.status(404).json({errorMessage: "No products found."})
        }
    }catch(error) {
        res.status(500).json({errorMessage: error.message})
    }
});

app.get('/products/:id', async (req, res) => {
    let {id} = req.params
    try {
        let product = await productManager.getProductById(Number(id))
        if(product) {
            res.status(200).json(product)
        }else{
            res.status(404).json({errorMessage: "Product not found."})
        }
    }catch(error) {
        res.status(500).json({errorMessage: error.message})
    }
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});

