import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";

import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

/* READ ROUTES */
// we call our database with our /:id
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE ROUTES*/
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);


export default router;