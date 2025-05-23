const productController = require('../controllers/productsController');
const usersController = require('../controllers/usersController');

function router(req, res) {
  const { url, method } = req;

  if (url === '/api/login' && method === 'POST') {
    return usersController.login(req, res);
  }

  else if (url.startsWith('/api/user/') && method === 'GET') {
		const id = url.split('/')[2];

		return usersController.getProfile(req, res, id);
  }

	else if ((url === '/api/main') && method === 'GET') {
    return productController.getAllProducts(req, res);
  }

  else if (url.startsWith('/api/product/') && method === 'GET') {
    const id = url.split('/')[2];
    return productController.getProductById(req, res, id);
  }

  res.statusCode = 404;
  res.end('Not Found');
}

module.exports = router;
