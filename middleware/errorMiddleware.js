function notFound(req, res, next) {
    res.status(404).json({
        status: "error",
        message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
        data: null
    });
}

function errorHandler(err, req, res, next) {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: "error",
        message: err.message || "Terjadi kesalahan pada server",
        data: null
    });
}

module.exports = {
    notFound,
    errorHandler
};