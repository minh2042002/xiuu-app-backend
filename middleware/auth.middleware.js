import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export const authenticate = (req, res, next) => {
    const accessToken = req.headers["access-token"];
    if (accessToken) {
        jwt.verify(accessToken, accessTokenSecret, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ message: "Token is not valid!"});
            }
            req.user = user;
            next();
        })
    }
    else {
        return res.status(401).json({ message: "You're not authenticated!"});
    }

};

export const refreshTokenMiddleware = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ message: "Refresh token is not valid!"});
            }

            req.user = user;
            next();
        })
    }
    else {
        return res.status(401).json({ message: "You're not authenticated!"});
    }
}

export const isAdmin = (req, res, next) => {
    const accessToken = req.headers["access-token"];
    if (accessToken) {
        jwt.verify(accessToken, accessTokenSecret, (err, user) => {
            if (err) {
                console.err(err);
                return res.status(403).json({ message: "Token is not valid!"});
            }
            if (user.admin) {
                next();
            } else {
                return res.status(403).json({ message: "You're not allowed request!"});
            }
        })
    }
}