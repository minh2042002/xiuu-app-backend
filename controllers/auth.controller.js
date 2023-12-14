import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = async (user) => {
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin,
        },
        accessTokenSecret,
        { expiresIn: accessTokenLife }
    );
};

const generateRefreshToken = async (user) => {
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin,
        },
        refreshTokenSecret,
        { expiresIn: refreshTokenLife }
    );
};

export const signup = async (req, res) => {
    const { name, email, pwd } = req.body;
    let existUser;
    try {
        existUser = await User.findOne({ email });
        if (existUser) {
            return res
                .status(400)
                .json({ message: "User already exists! Login instead" });
        }

        const hashedPassword = bcrypt.hashSync(pwd);
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        const { password, ...others } = user._doc;
        return res.status(201).json({ user: others });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, pwd } = req.body;
    let user;
    try {
        user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        let isPasswordCorrect = bcrypt.compareSync(pwd, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password!" });
        }

        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict", // Ngăn chặn tấn công CSRF
        });

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            accessToken: accessToken,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("refreshToken");
    await User.findByIdAndUpdate(req.user.id, { $set: { refreshToken: "" } })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "Not found user!" });
            }

            return res.status(200).json({ message: "Log out!"});
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
        });
};

export const refreshToken = async (req, res) => {
    const refreshTokenFromClient = req.cookies.refreshToken;
    if (!refreshTokenFromClient) {
        return res.status(401).json({ message: "You're not authenticated!" });
    }

    const existUser = await User.findOne({ refreshToken: refreshTokenFromClient });
    if (!existUser) {
        return res.status(403).json({ message: "Not found refresh token for user!" });
    }

    const newAccessToken = await generateAccessToken(existUser);
        return res.status(200).json({ newAccessToken });
};
