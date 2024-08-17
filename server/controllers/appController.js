import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator'

/** Middleware to verify user existence */
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method === "GET" ? req.query : req.body;

        // Check user existence
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

/** POST: /api/register */
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ error: "Username, password, and email are required" });
        }

        // Check if username or email already exists
        const userExist = await UserModel.findOne({ username });
        if (userExist) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const emailExist = await UserModel.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // Hash password and save new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || '',
            email
        });

        await user.save();
        return res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

/** POST: /api/login */
export async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).json({ error: "Username not found" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(400).json({ error: "Incorrect password" });

        // Create JWT token
        const token = jwt.sign({
            userId: user._id,
            username: user.username,
        }, ENV.JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).json({
            message: "Login successful",
            username: user.username,
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

/** GET: /api/user/:username */
export async function getUser(req, res) {
    const { username } = req.params;

    if (!username) return res.status(400).json({ error: "Invalid username" });

    try {
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        // removes the password value from user and converts it to JSON as mongoose return unnecessary data
        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(200).json(rest);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

/** PUT: /api/updateuser */
export async function updateUser(req, res) {
    try {
        const { userId } = req.user;

        if (userId) {
            const body = req.body;

            // Update data
            const result = await UserModel.updateOne({ _id: userId }, body);

            if (result.nModified === 0) {
                return res.status(404).json({ error: "User Not Found or No Changes Made" });
            }

            return res.status(200).json({ msg: "Database Updated" });
        } else {
            return res.status(400).json({ error: "ID not provided" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

/** GET: /api/generateOTP */
export async function generateOTP(req, res) {
    let OTP = await otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}

/** GET: /api/verifyOTP */
export async function verifyOTP(req, res) {
    // Implement your verifyOTP logic here
    res.json('verifyOTP route');
}

/** GET: /api/createResetSession */
export async function createResetSession(req, res) {
    // Implement your createResetSession logic here
    res.json('createResetSession route');
}

/** PUT: /api/resetPassword */
export async function resetPassword(req, res) {
    // Implement your resetPassword logic here
    res.json('resetPassword route');
}
