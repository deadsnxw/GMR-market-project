const loggingMW = (req, res) => {
  console.log(`
    [REQUEST]\n
    Time: [${new Date().toISOString()}]\n 
    Method: ${req.method}\n
    Url: ${req.url}\n
    `);
};

const loggingAW = (req, res) => {
  console.log(`
    [RESPONSE]\n
    Time: [${new Date().toISOString()}]\n
    Method: ${req.method}\n
    Url: ${req.url}\n
    Response status: ${res.statusCode}\n
    `);
};

module.exports = {
    loggingMW,
    loggingAW
};
