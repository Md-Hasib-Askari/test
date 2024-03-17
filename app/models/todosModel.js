import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    topic: {
        type: String,
    },
    details: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }
}, {
    versionKey: false,
    timestamps: true,
});

const Post = new mongoose.model("Post", postSchema);

module.exports = Post;