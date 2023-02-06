import mongoose, { mongo } from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: { // we check if the user exists in the map who liekd the post
        type: Map,
        of: Boolean,
    },
    comments: {
        type: Array,
        default: []
    }
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);

export default Post;