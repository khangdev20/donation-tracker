import User from "./User.js";

class Admin extends User {
    #isSuperAdmin;

    constructor({
        id,
        name,
        email,
        password,
        address,
        stripeCustomerId,
        paymentMethods,
        isSuperAdmin = false,
    }) {
        super({
            id,
            name,
            email,
            password,
            address,
            role: "admin",
            stripeCustomerId,
            paymentMethods,
        });

        this.#isSuperAdmin = isSuperAdmin;
    }

    isSuperAdmin() {
        return this.#isSuperAdmin;
    }
}

export default Admin;
