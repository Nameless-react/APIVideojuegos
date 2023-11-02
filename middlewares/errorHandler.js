export default (error, req, res, next) => {
    const status = error.status ?? 500;
    console.error(error.message + "\n\n");
    res.status(status).json({
        status: "failed",
        message: JSON.parse(error.message),
        data: []
    })

}