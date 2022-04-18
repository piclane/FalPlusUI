const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:8091/", // API のベース URL
            changeOrigin: true,
        })
    );

    app.use(
        "/tv",
        createProxyMiddleware({
            target: "http://localhost:8092/", // ANIME LOCKER のベース URL
            changeOrigin: true,
        })
    );

    app.use(
        "/images",
        createProxyMiddleware({
            target: "http://localhost:8092/", // ANIME LOCKER のベース URL
            changeOrigin: true,
        })
    );
};
