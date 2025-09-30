import Admin from "../entities/Admin.js";
import Participant from "../entities/Participant.js";

class UserFactory {
    static createUser(role, data = {}) {
        switch (role) {
            case "admin":
                return new Admin({ ...data });
            case "participant":
                return new Participant({ ...data });
            default:
                throw new Error("Invalid role");
        }
    }

    static userToDomain(user) {
        switch (user.role) {
            case "admin":
                return new Admin({ ...user });
            case "participant":
                return new Participant({ ...user });
            default:
                throw new Error("Invalid role");
        }
    }
}

export default UserFactory;
