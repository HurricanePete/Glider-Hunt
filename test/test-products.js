require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {Products} = require('../models');
const {DATABASE_URL} = require('../config');

const should = chai.should();

chai.use(chaiHttp);

function seedProductData() {
	console.info('seeding glider data');
	const seedData =[];
	for(let i=1; i<=10; i++) {
		seedData.push(generateProductData());
	}
	return Products.insertMany(seedData);
};

function generateSizes() {
	let sizeArray = [];
	const sizeLength = Math.floor(Math.random() * 10);
	for(let i=0; i<=sizeLength; i++) {
		sizeArray.push(faker.commerce.productMaterial());
	};
	return sizeArray;
}

function generatePricing() {
	let pricingArray = [];
	const priceLength = Math.floor(Math.random() * 10);
	for(let i=0; i<=priceLength; i++) {
		pricingArray.push(faker.commerce.price());
	};
	return pricingArray;
}

function generateProductData() {
	return {
		manufacturer: faker.company.companyName(),
		name: faker.commerce.productName(),
		sizes: generateSizes(),
		pricing: generatePricing()
	};
};

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
};

describe('Glider Hunt API resource', function() {
	before(function() {
		return runServer(DATABASE_URL);
	});
	beforeEach(function() {
		return seedProductData();
	});
	afterEach(function() {
		return tearDownDb();
	});
	after(function() {
		return closeServer();
	});

	describe('GET endpoint', function() {
		it('should return all products', function() {
			let res;
			return chai.request(app)
			.get('/api/all')
			.then(function(_res) {
				res = _res;
				res.should.have.status(200);
				res.body.should.have.length.of.at.least(1);
				return Products.count()
			})
			.then(function(count) {
				res.body.length.should.equal(count);
			});
		});

		it('should return products with the correct fields',  function() {
			let resProducts;
			return chai.request(app)
			.get('/api/all')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.should.have.length.of.at.least(1);
				res.body.forEach(function(product) {
					product.should.be.a('object');
					product.should.include.keys('manufacturer', 'name', 'sizes', 'pricing');
				});
				resProducts = res.body[0];
				return Products.findById(resProducts._id);
			})
			.then(function(product) {
				resProducts._id.should.equal(product.id);
				resProducts.manufacturer.should.equal(product.manufacturer);
				resProducts.name.should.equal(product.name);
				resProducts.sizes.should.deep.equal(product.sizes);
				resProducts.pricing.should.deep.equal(product.pricing);
			});
		});
	});

	describe('POST endpoint', function() {
		it('should add a new product with the correct fields', function() {
			const newProduct = generateProductData();
			return chai.request(app)
			.post('/api')
			.send(newProduct)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('manufacturer', 'name', 'sizes', 'pricing');
				res.body.should.not.be.null;
				res.body.manufacturer.should.equal(newProduct.manufacturer);
				res.body.name.should.equal(newProduct.name);
				res.body.sizes.should.deep.equal(newProduct.sizes);
				res.body.pricing.should.deep.equal(newProduct.pricing);
			});
		});
	});

	describe('DELETE endpoint', function() {
		it('should delete product with the supplied id', function() {
			let product;
			return Products
			.findOne()
			.exec()
			.then(function(_prod) {
				product = _prod;
				return chai.request(app)
				.delete(`/api/${product._id}`);
			})
			.then(function(res) {
				res.should.have.status(204)
				return Products.findById(product._id)
				.exec()
			})
			.then(function(_prod) {
				should.not.exist(_prod);
			});
		});
	});

	describe('PUT endpoint', function() {
		it('should update a product correctly', function() {
			const updateData = {
				manufacturer: 'MyFancyCompany',
				name: 'MyFancyName',
				sizes: ['FancySizeOne', 'FancySizeTwo', 'FancySizeThree'],
				pricing: ['FancyPriceOne', 'FancyPriceTwo', 'FancyPriceThree']
			}
			return Products
			.findOne()
			.exec()
			.then(function(product) {
				updateData.id = product._id;
				return chai.request(app)
				.put(`/api/${product._id}`)
				.send(updateData);
			})
			.then(function(res) {
				res.should.have.status(201);
				return Products
				.findById(updateData.id)
				.exec()
			})
			.then(function(prod) {
				prod.manufacturer.should.equal(updateData.manufacturer);
				prod.name.should.equal(updateData.name);
				prod.sizes.should.deep.equal(updateData.sizes);
				prod.pricing.should.deep.equal(updateData.pricing);
			});	
		});
	});
});