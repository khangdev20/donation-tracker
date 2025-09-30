import jwt from "jsonwebtoken";
class PasswordUtils {
    static hashPassword(password) {
        // Implement password hashing logic here
    }
    static comparePassword(plainPassword, hashedPassword) {
        // Implement password comparison logic here
    }
}

class JwtUtils {
    static generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    }

    static verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}

export { JwtUtils, PasswordUtils };
