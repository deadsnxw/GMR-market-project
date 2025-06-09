const loggingMW = (req, res) => {
  console.log(`[REQUEST]
Time: [${new Date().toISOString()}] 
Method: ${req.method}
Url: ${req.url}
    `);
};

const loggingAW = (req, res) => {
  console.log(`[RESPONSE]
Time: [${new Date().toISOString()}]
Method: ${req.method}
Url: ${req.url}
Response status: ${res.statusCode}
    `);
};

module.exports = {
    loggingMW,
    loggingAW
};
