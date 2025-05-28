const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    id : { type : String },
    name : { type : String },
    price : { type : Number },
    formula : { type : String },
    brandName : { type : String },
    category : { type : String },
    discountedPrice : { type : Number },
    discount : { type : Number },
    quantity : { type : Number, required: true, min: 0, default: 0 },
    stockStatus: { type : String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'Out of Stock' },
    deliveryTime : { type : String },
    rating : { type : Number },
    reviewCount : { type : Number },
    description : { type : String },
    packSize: { type : String },    
    composition: { type : String },
    mfgDate: { type: Date },  
    expDate: { type: Date },  
    prescriptionRequired : { type : Boolean },
    images : { type : Array },
    keyBenefits : { type : Array },
    sideEffects : { type : Array },
    usageDirections: { type : String },
    similarProducts: { type : Array },
});

productSchema.pre('save', function(next) {
    if (this.quantity === 0) {
        this.stockStatus = 'Out of Stock';
    } else if (this.quantity <= 10) {
        this.stockStatus = 'Low Stock';
    } else {
        this.stockStatus = 'In Stock';
    }
    next();
});

module.exports = mongoose.model('products', productSchema);
