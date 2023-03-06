import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: []
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: { // functions to modify the global state
        setMode: (state) => { // change the display to either light or dark mode based off current state 
            state.mode = state.mode === "light" ? "dark": "light";
        },
        setLogin: (state, action) => { 
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => { // null values when user logsout
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error("User friends are non existant");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => { // return the updated post that we change from the backend
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post_id)  {
                    return action.payload.post;
                } else {
                    return post;
                }
            });
            state.posts = updatedPosts;
        }
    }
});

export const {setMode, setLogin, setLogout, setFriends, setPosts, setPost} = authSlice.actions;
export default authSlice.reducer;