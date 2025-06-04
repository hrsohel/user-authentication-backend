import jwt from "jsonwebtoken"

export const authorizeUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Token missing or malformed' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, "my-secret");
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err)
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        } else {
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }
    }
}

export const authorizeSubDomain = async (req, res, next) => {
    try {
        // const authHeader = req.headers.authorization;
        // console.log(authHeader)
        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     return res.status(401).json({ success: false, message: 'Token missing or malformed' });
        // }
        // const v = authHeader.split(' ')[1];
        // const original = Buffer.from(v, 'base64url').toString();
        // console.log(original)
        next()
    } catch (err) {
        console.log(err)
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        } else {
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }
    }
}