import User from "../Models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        // find the users id 
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);


    } catch (error) {
        res.status(404).json( {message: error.message });
    }
}

export const getUserFriends = async (req, res) => {
    
    try {
    const { id } = req.params; 
    const user = await User.findById(id);

    // make multiple api calls to the database for the users friends
    const freinds = await Promise.all(
        user.friends.map((id) => User.findById(id))
    );
    // format all our friends 
    const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return {_id, firstName, lastName, occupation, location, picturePath }; 
        }
    );
    // send all the friends data to the front end
    res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/* UPDATE */

export const addRemoveFriend = async (req, res) => {
   // removing a friend
    try {
        
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            // remove the friend from the users friend list and the friends friend list
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            // when one friend gets added its added to both the user and the friend
            user.friend.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const freinds = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        // format all our friends 
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return {_id, firstName, lastName, occupation, location, picturePath }; 
            }
        );

        res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}