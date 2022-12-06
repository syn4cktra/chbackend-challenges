const fs = require('fs')

class ProductManager { 
  constructor(path) {
    this.path = path;
    this.data = [] 
    this.init()
  }

  init() {
    try{
      const dataFile = fs.existsSync(this.path, 'utf-8')
      if(!dataFile) {
        fs.writeFileSync(this.path, JSON.stringify([]))
      }
      return null
    }catch(error) {
      console.log(error.message)
      return {
        errorMessage: error.message
      }
    }
  }

  async getProducts(limit) {
    try {
        const products = await fs.promises.readFile(this.path)
        if(limit) {
            return JSON.parse(products).slice(0, limit)
        }else{
            return JSON.parse(products)
        }
    }catch(error) {
      throw new Error(error)
    }
  }

  async addProduct(newProduct) {
    const data = await this.getProducts();
    if(!(data.find(product => product.code === newProduct.code))) {
      const id = (data[data.length - 1]?.id ?? 0) + 1
      newProduct = {id: id, ...newProduct}
      const newProductsList = JSON.stringify([...data, newProduct])
      try {
        await fs.promises.writeFile(this.path, newProductsList)
        return id;
      }catch(error) {
        throw new Error(error)
      }
    }else {
      console.log("ERROR: Code already exists.")
    }
  }

  async getProductById(id) {
    const data = await this.getProducts()
    return data.find(product => product.id === id);
  }

  async removeProductById(id) {
    const data = await this.getProducts()
    const newData = data.filter(product => product.id !== id)
    try{
      await fs.promises.writeFile(this.path, JSON.stringify(newData))
    }catch(error) {
      throw new Error(error)
    }
  }

  async updateProduct(id, updatedProduct) {
    let products = await this.getProducts()
    if((products.find(product => product.id === id))) {
      await this.removeProductById(id)
      products = await this.getProducts();
      updatedProduct = {id, ...updatedProduct};
      const updatedData = JSON.stringify([ ...products, updatedProduct ])
      try {
        await fs.promises.writeFile(this.path, updatedData)
        return id;
      } catch (error) {
        throw new Error(error);
      }
    }else {
      console.log("ERROR: Product doesn't exists.");
    }
    
  }
}

module.exports = ProductManager

