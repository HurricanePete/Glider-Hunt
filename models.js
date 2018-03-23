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

const emailSchema = mongoose.Schema({
	name: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: true
	}
})

const Emails = mongoose.model('Emails', emailSchema);

module.exports = {Products, Emails};