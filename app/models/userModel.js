const mongoose = require("mongoose");

const userModel =mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'pending'],
            default: 'pending',
        },
        otp: {
            type: String,
            default: "0123"
        },
        posts: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Post',
            }
        ]

    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const User = new mongoose.model("User", userModel);

module.exports = User;