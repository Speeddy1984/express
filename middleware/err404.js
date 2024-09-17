module.exports = (req, res) => {
    res.status(404).json({
        message: 'Ресурс не найден',
        status: 404
    });
}