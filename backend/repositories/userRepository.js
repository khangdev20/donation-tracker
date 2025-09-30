import User from "../models/User.js";
import BaseRepository from "./baseRepository.js";

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return this._model.findOne({ email });
    }
}

export default UserRepository;
