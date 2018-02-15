const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	manufacturer: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	sizes: {
		type: Array,
		required: true
	},
	pricing: {
		type: Array,
		required: true
	}
})

const Products = mongoose.model('Products', productSchema);

module.exports = {Products};