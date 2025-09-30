class User {
    #name;
    #lastName;
    #email;
    #password;
    #address;
    #role;
    #stripeCustomerId;
    #paymentMethods;

    constructor({
        name,
        lastName,
        email,
        password,
        address = "",
        role = "participant",
        stripeCustomerId = "",
        paymentMethods = [],
    }) {
        this.#name = name;
        this.#lastName = lastName;
        this.#email = email.toLowerCase().trim();
        this.#password = password;
        this.#address = address;
        this.#role = role.toLowerCase().trim();
        this.#stripeCustomerId = stripeCustomerId;
        this.#paymentMethods = paymentMethods;
    }

    getFullName() {
        return `${this.#name} ${this.#lastName || ""}`.trim();
    }

    getEmail() {
        return this.#email;
    }

    getAddress() {
        return this.#address;
    }

    getRole() {
        return this.#role;
    }

    getPaymentMethods() {
        return this.#paymentMethods;
    }

    addPaymentMethod(method) {
        this.#paymentMethods.push(method);
    }

    changeAddress(newAddress) {
        this.#address = newAddress;
    }

    changeRole(newRole) {
        this.#role = newRole;
    }

    toJSON() {
        return {
            name: this.#name,
            lastName: this.#lastName,
            email: this.#email,
            address: this.#address,
            role: this.#role,
            stripeCustomerId: this.#stripeCustomerId,
            paymentMethods: this.#paymentMethods,
            password: this.#password,
        };
    }
}

export default User;
