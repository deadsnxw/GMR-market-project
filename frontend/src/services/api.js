const API_BASE_URL = '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorText;
    try {
      errorText = await response.text();
    } catch (e) {
      errorText = response.statusText;
    }
    
    const error = new Error(errorText || 'Server error');
    error.status = response.status;
    throw error;
  }
  return response.json();
};


export const api = {
  getTags: async () => {
    const response = await fetch(`${API_BASE_URL}/onEdit`);
    return handleResponse(response);
  },

  getProduct: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`);
    return handleResponse(response);
  },

  getProducts: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    return handleResponse(response);
  },
  
  updateUser: async (userId, data) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateBalance: async (userId, data) => {
    const response = await fetch(`${API_BASE_URL}/balance/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateProduct: async (productId, data) => {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  login: async (data) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getMain: async (data) => {
    const response = await fetch(`${API_BASE_URL}/main`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  checkOwnership: async (productId, userId) => {
    const response = await fetch(`${API_BASE_URL}/check/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
  },

  buyProduct: async (productId, userId) => {
    const response = await fetch(`${API_BASE_URL}/buy/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
  },

  createProduct: async (body) => {
    const response = await fetch(`${API_BASE_URL}/create `, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  deleteProduct: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
  }
};