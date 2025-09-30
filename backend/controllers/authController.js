import { compare } from "bcrypt";
import UserFactory from "../factories/UserFactory.js";
import UserRepository from "../repositories/userRepository.js";
import { JwtUtils } from "../utils/security.js";
class AuthController {
    constructor() {
        this._userRepository = new UserRepository();
    }
    async registerUser(req, res) {
        const { name, email, password } = req.body;
        try {
            const userData = UserFactory.createUser("participant", {
                name,
                email,
                password,
            });
            const userExists = await this._userRepository.findByEmail(
                userData.email
            );
            if (userExists)
                return res.status(400).json({ message: "User already exists" });

            const user = await this._userRepository.create(userData.toJSON());

            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                token: JwtUtils.generateToken(user.id),
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProfile(req, res) {
        try {
            const user = await this._userRepository.findOneById(req.user.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });

            res.status(200).json({
                name: user.name,
                email: user.email,
                university: user.university,
                address: user.address,
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
        }
    }

    async loginUser(req, res) {
        const { email, password } = req.body;
        try {
            const user = await this._userRepository.findByEmail(email);
            if (user && (await compare(password, user.password))) {
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: JwtUtils.generateToken(user.id),
                });
            } else {
                res.status(401).json({ message: "Invalid email or password" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const user = await this._userRepository.findOneById(req.user.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });

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
    }
}

export default new AuthController();
