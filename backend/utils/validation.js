import { body } from "express-validator";

export const registerValidation = [
    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password needs at least 1 uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password needs at least 1 lowercase letter")
        .matches(/\d/)
        .withMessage("Password needs at least 1 number"),
];

export const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password needs at least 1 uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password needs at least 1 lowercase letter")
        .matches(/\d/)
        .withMessage("Password needs at least 1 number"),
];

export const uploadMultipleFilesValidation = [
    body().custom((value, { req }) => {
        const files = req.files;
        if (!files) {
            throw new Error("Files are required");
        }
        if (files.length === 0) {
            throw new Error("Files are required");
        }
        for (const file of files) {
            if (file.size > 1024 * 1024 * 10) {
                throw new Error("File size must be less than 10MB");
            }
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png"
            ) {
                throw new Error("File must be a JPEG or PNG image");
            }
            return true;
        }
    }),
];

export const createCampaignValidation = [
    body("title")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Title must be at least 2 characters"),
    body("description")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Description must be at least 2 characters"),
    body("goalAmount").isNumeric().withMessage("Amount must be a number"),
    body("currency").isIn(["AUD"]).withMessage("Invalid currency"),
    body("deadline").isISO8601().withMessage("Invalid deadline date"),
    body("imageUrl").isURL().withMessage("Invalid image URL"),
];
