import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { create, findById, findOne } from "../models/User";

const generateToken = (id) => {
    return sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });

        const user = await create({ name, email, password });
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findOne({ email });
        if (user && (await compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            university: user.university,
            address: user.address,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, email, university, address } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.university = university || user.university;
        user.address = address || user.address;

        const updatedUser = await user.save();
        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            university: updatedUser.university,
            address: updatedUser.address,
            token: generateToken(updatedUser.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default { registerUser, loginUser, updateUserProfile, getProfile };
