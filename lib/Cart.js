module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id, qty) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        
        storedItem.qty+= qty;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty+=qty;
        this.totalPrice += storedItem.item.price * qty;
    };

    this.update = function(item, id, qty){
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        var oldQty = storedItem.qty;
        storedItem.qty= qty;
        storedItem.price = storedItem.item.price * storedItem.qty;
        var newQty = qty - oldQty;
        this.totalQty+=newQty;
        this.totalPrice += storedItem.item.price * newQty;
    }

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};