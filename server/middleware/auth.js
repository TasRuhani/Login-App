import jwt from 'jsonwebtoken';
import ENV from '../config.js';

/** Auth Middleware */
export default async function Auth(req, res, next) {
    try {
        // Access authorization header to validate request
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // Retrieve the user details for the logged in user
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

        // Attach the user information to the request object
        req.user = decodedToken;

        // Pass control to the next middleware or route handler
        next();
    } catch (error) {
        res.status(401).json({ error: "Authentication Failed" });
    }
}
