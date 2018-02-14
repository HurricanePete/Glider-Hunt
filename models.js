const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ProductSchema = mongoose.Schema({
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

const Products = mongoose.model('Products', ProductSchema);

module.exports = {Products};