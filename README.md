# Glider-Hunt
RESTful API prototype for Glider Hunt - find your perfect glider

##API Docs

The RESTful API serves 5 endpoints:

-A GET request to /api/all will return a list of all existing products in the database
-A GET request to /api/:productId will return an individual product with the matching ID if it exists
-A POST request to /api will add a product with the supplied information and return the created product
&nbsp;&nbsp;&nbsp;&nbsp;The request body should be an object with the following keys:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-manufacturer: manufacturer name --> string
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-name: product name --> string
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-sizes: product sizes --> array
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-pricing: product prices --> array
-A PUT request to /api/:productId will edit an existing product with the matching ID and return the updated product
&nbsp;&nbsp;&nbsp;&nbsp;The request body should be an object with the following keys:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-id: product ID --> string
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-manufacturer: manufacturer name --> string
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-name: product name --> string
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-sizes: product sizes --> array
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-pricing: product prices --> array
&nbsp;&nbsp;&nbsp;&nbsp;The ID from the URL and the ID from the request body must match
-A DELETE request to /api/:productId will delete an individual product with the matching ID if it exists
&nbsp;&nbsp;&nbsp;&nbsp;Nothing is return by the server from a DELETE request
