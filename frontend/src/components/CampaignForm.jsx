import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { toFullIsoFromDatetimeLocal } from "../utils/datetime";
import DateTimeSelector from "./DateTimeSelector";
import FileUploadForm from "./FileUploadForm";
import ShowInputError from "./ShowInputError";

export const createFundingNeedSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, { message: "Title must be at least 2 characters" }),
    description: z
        .string()
        .trim()
        .min(2, { message: "Description must be at least 2 characters" }),
    goalAmount: z.coerce.number({
        invalid_type_error: "Amount must be a number",
    }),
    currency: z
        .string()
        .refine((v) => v === "AUD", { message: "Invalid currency" }),
    deadline: z.string().datetime({ message: "Invalid deadline date" }),
    imageUrl: z.string().url({ message: "Invalid image URL" }),
});

const FundingNeedForm = () => {
    const [errors, setErrors] = useState({});
    const [validationErrors, setValidationErrors] = useState([]);

    const { isAuthenticated, getAccessToken } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        goalAmount: 0,
        currency: "AUD",
        deadline: "",
        status: "active",
        currentAmount: 0,
        category: "",
        imageUrl: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = createFundingNeedSchema.safeParse(formData);
            if (!result.success) {
                toast.error("Campaign creation failed. Please try again.");
                const { fieldErrors, formErrors } = result.error.flatten();
                setErrors({
                    ...fieldErrors,
                    form: formErrors[0] || "",
                });
                return;
            }
            await axiosInstance.post("/api/campaigns", formData, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            });

            toast.success("Campaign created successfully.");
            navigate("/");
        } catch (error) {
            if (error?.response?.data?.errorType === "validation") {
                toast.error("Campaign creation failed.");
                setValidationErrors(error?.response?.data?.validationErrors);
                return;
            } else {
                toast.error(error?.response?.data?.message);
            }
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="max-w-md mx-auto mt-20">
            <form
                className="bg-gray-50 p-8 shadow-lg rounded-2xl max-w-md mx-auto border border-gray-200"
                onSubmit={handleSubmit}
            >
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
                    Create Campaign
                </h1>
                <div className="space-y-6">
                    <div>
                        <label
                            htmlFor="Title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Enter the title of the funding need"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                        <ShowInputError
                            name="title"
                            errors={errors}
                            validationErrors={validationErrors}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            placeholder="Enter the description of the funding need"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                        <ShowInputError
                            name="description"
                            errors={errors}
                            validationErrors={validationErrors}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="goalAmount"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Goal Amount
                        </label>
                        <input
                            id="goalAmount"
                            type="number"
                            placeholder="Enter the goal amount of the funding need"
                            value={formData.goalAmount}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    goalAmount: e.target.value,
                                }))
                            }
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                        <ShowInputError
                            name="goalAmount"
                            errors={errors}
                            validationErrors={validationErrors}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="currency"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Currency
                        </label>
                        <select
                            id="currency"
                            disabled
                            value={formData.currency}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    currency: e.target.value,
                                }))
                            }
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="AUD">AUD</option>
                        </select>
                        <ShowInputError
                            name="currency"
                            errors={errors}
                            validationErrors={validationErrors}
                        />
                    </div>
                    <DateTimeSelector
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                deadline: toFullIsoFromDatetimeLocal(
                                    e.target.value
                                ),
                            }));
                        }}
                    />
                    <ShowInputError
                        name="deadline"
                        errors={errors}
                        validationErrors={validationErrors}
                    />

                    <FileUploadForm
                        onUploadSuccess={(images) => {
                            console.log(images);
                            setFormData((prev) => ({
                                ...prev,
                                imageUrl: images.data[0],
                            }));
                        }}
                    />
                    <ShowInputError
                        name="imageUrl"
                        errors={errors}
                        validationErrors={validationErrors}
                    />

                    <div className="flex justify-between gap-3">
                        <button className="w-full bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FundingNeedForm;
