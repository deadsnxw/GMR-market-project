const productController = require('../controllers/productsController');
const usersController = require('../controllers/usersController');

function apiRouter(req, res) {
  const { url, method } = req;

  // DONE
  if (url === '/api/login' && method === 'POST') {    
    return usersController.login(req, res);
  }

  // DONE
  else if (url.startsWith('/api/user/') && method === 'GET') {
    const id = url.split('/')[3];
    return usersController.getProfile(req, res, id);
  }
  
  // DONE
  else if ((url === '/api/main') && method === 'GET') {
    return productController.getAllProducts(req, res);
  }

  // DONE
  else if (url.startsWith('/api/product/') && method === 'GET') {
    const id = url.split('/')[3];
    return productController.getProductById(req, res, id);
  }

  // DONE
  else if (url.startsWith('/api/product') && method === 'POST') {
    const id = url.split('/')[3];
    return productController.buy_check(req, res, id);
  }

  // DONE
  else if (url.startsWith('/api/product') && method === 'DELETE') {
    const id = url.split('/')[3];
    return productController.remove(req, res, id);
  }

  // DONE
  else if (url === ('/api/new') && method === 'POST') {
    return productController.create(req, res);
  }

  // DONE
  else if (url.startsWith('/api/product') && method === 'PATCH') {
    const id = url.split('/')[3];
    return productController.patch(req, res, id);
  }

  // DONE
  else if (url === ('/api/balance') && method === 'PATCH') {
    return usersController.balance(req, res);
  }

  // DONE
  else if (url === ('/api/registration') && method === 'POST') {
    return usersController.registration(req, res);
  }

  // DONE
  else if (url.startsWith('/api/user') && method === 'PATCH') {
    const id = url.split('/')[3];
    return usersController.patch(req, res, id)
  }

  res.statusCode = 404;
  res.end('Not Found');
}

module.exports = apiRouter;
