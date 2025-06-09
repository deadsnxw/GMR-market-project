class Command {
  constructor(handler, middleware = [], afterware = []) {
    this.handler = handler;
    this.middleware = middleware;
    this.afterware = afterware;
  }

  async execute(req, res, params = []) {
    try {
      for (const mw of this.middleware) {
        const result = await mw(req, res);
        if (result === false) return;
      }

      await this.handler(req, res, params);

      for (const aw of this.afterware) {
        const result = await aw(req, res);
        if (result === false) return;
      }

    } catch (error) {
      console.error(`[Error]: ${error.message}`);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }
  }
}

module.exports = Command;
