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
    quantity : { type : Number },
    stockStatus: { type : String },
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

module.exports = mongoose.model('products', productSchema);
