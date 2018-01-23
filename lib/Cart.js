'use strict';

const config = require('../config');


class Cart {
    constructor() {
        this.data = {};
        this.data.items = [];
        this.data.quantity = 0;
        this.data.totals = 0;
        this.data.formattedTotals = '';
    }

    getOldCart(oldCart){
      console.log("======= getting current cart")
      if(oldCart.data){
        this.data.items = oldCart.data.items;
        this.data.quantity = oldCart.data.quantity;
        this.data.totals = oldCart.data.totals;
        this.data.formattedTotals = oldCart.data.formattedTotals;
      }
    }

    addToCart(product = null, qty = 1, oldCart) {
        this.getOldCart(oldCart)
        if(!this.inCart(product._id)) {
            let format = new Intl.NumberFormat(config.locale.lang, {style: 'currency', currency: config.locale.currency });
            //console.log(product)
            let prod = {
              id: product._id,
              name: product.code + " " + product.name + " - " + product.rarity,
              price: product.price,
              qty: qty,
              image: product.frontImage,
              formattedPrice: format.format(product.price)
            };
            //console.log(prod)
            this.data.items.push(prod);
            this.calculateTotals();
        }
    }

    removeFromCart(id = 0) {
        for(let i = 0; i < this.data.items.length; i++) {
            let item = this.data.items[i];
            if(item.id === id) {
                this.data.items.splice(i, 1);
                this.calculateTotals();
            }
        }

    }

    updateCart(ids = [], qtys = []) {
        let map = [];
        let updated = false;

        ids.forEach(id => {
           qtys.forEach(qty => {
              map.push({
                  id: parseInt(id, 10),
                  qty: parseInt(qty, 10)
              });
           });
        });
        map.forEach(obj => {
            this.data.items.forEach(item => {
               if(item.id === obj.id) {
                   if(obj.qty > 0 && obj.qty !== item.qty) {
                       item.qty = obj.qty;
                       updated = true;
                   }
               }
            });
        });
        if(updated) {
            this.calculateTotals();
        }
    }

    inCart(productID = 0) {
        let found = false;
        this.data.items.forEach(item => {
           if(item.id === productID) {
               found = true;
           }
        });
        return found;
    }

    calculateTotals() {
        this.data.quantity = 0;
        this.data.totals = 0;
        this.data.items.forEach(item => {
            let price = item.price;
            let qty = item.qty;
            let amount = price * qty;

            this.data.quantity += qty; //tambien calculamos el total de productos
            this.data.totals += amount;
        });
        this.setFormattedTotals();
    }
    saveCart(request) {
      console.log(request.session)
      if(request.session) {
        console.log(request.session)
        request.session.cart = this.data;
      }
    }
    emptyCart(request) {
        this.data.items = [];
        this.data.totals = 0;
        this.data.formattedTotals = '';
        if(request.session) {
            request.session.cart.items = [];
            request.session.cart.totals = 0;
            request.session.cart.formattedTotals = '';
        }


    }

    setFormattedTotals() {
        let format = new Intl.NumberFormat(config.locale.lang, {style: 'currency', currency: config.locale.currency });
        let totals = this.data.totals;
        this.data.formattedTotals = format.format(totals);
    }

}

module.exports = new Cart();