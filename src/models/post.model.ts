import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: []
    }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;