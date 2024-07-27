const authMiddleware = async (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send({
            message: 'Unauthorized.'
        });
    }
    next();
};

module.exports = authMiddleware;