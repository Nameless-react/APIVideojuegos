export default (error, req, res, next) => {
    const status = error.statusCode ?? 500;
    console.error(error.stack + "\n\n");
    console.error(error.name + "\n\n");
    res.status(status).json({
        status: error.status ?? "failed",
        message: JSON.parse(error.message),
        data: []
    })

}