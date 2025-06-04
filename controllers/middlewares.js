import jwt from "jsonwebtoken"

export const authorizeUser = async (req, res, next) => {
    try {
        // console.log("from profile api", req.session.token)
        console.log("from profile api", req.cookies)
        console.log("user-profile", req.hostname)
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
        // const token = req.session.token
        // const decoded = jwt.verify(token, "my-secret");
        // console.log(decoded)
        // req.user = decoded;
        // console.log("from subdomain", req.session)
        console.log("from subdomain", req.cookies)
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