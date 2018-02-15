require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {PORT, DATABASE_URL} = require('./config');

const {Products} = require('./models');

mongoose.Promise = global.Promise;

const app = express();

app.use(bodyParser.json());
app.use(morgan('common'));

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	if(req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}
	next();
});

app.get('/api/all', (req, res) => {
	return Products
	.find()
	.exec()
	.then(products => {
		res.json(products);
	})
});

app.get('/api/:id', (req, res) => {
	return Products
	.findById(req.params.id)
	.exec()
	.then(product => {
		res.json(product)
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Something went wrong'});
	})
})

app.post('/api', (req, res) => {
	const requiredFields = ['manufacturer', 'name', 'sizes', 'pricing'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if(missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}

	return Products
		.create({
			manufacturer: req.body.manufacturer,
			name: req.body.name,
			sizes: req.body.sizes,
			pricing: req.body.pricing
		})
		.then(product => res.status(201).json(product))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
});

app.delete('/api/:id', (req, res) => {
	Products
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(() => {
			res.status(204).json({messsage: 'success'});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something went wrong'});
		});
});

app.put('/api/:id', (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}
	const updated = {};
	const updateableFields = ['manufacturer', 'name', 'sizes', 'pricing'];
	updateableFields.forEach(field => {
		if(field in req.body) {
			updated[field] = req.body[field];
		}
	});

	Products
		.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
		.exec()
		.then(updatedPost => res.status(201).json(updatedPost))
		.catch(err => res.status(500).json({message: 'Something went wrong'}));
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if(err) {
				return reject(err);
			}
			server = app
				.listen(port, () => {
					console.log(`Your app is listening on port ${port}`);
					resolve();
				})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if(err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if(require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};