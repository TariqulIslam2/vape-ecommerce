const { createServer } = require('http');
const next = require('next');
const app = next({
    dev: false, // Set to 'false' for production
});
const handle = app.getRequestHandler();
app.prepare().then(() => {
    createServer((req, res) => {
        handle(req, res);
    }).listen(80, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:80');
    });
});