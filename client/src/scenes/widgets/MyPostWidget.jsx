import {
    EditOutlined,
    DeleteOutlined,
    AttatchFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
} from "@mui/icons-material";

import {Box, Divder, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery} from "@mui/material";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import { palette } from "@mui/system";


const MyPostWidget = ({picturePath}) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState(""); // represents post content discription
    const [palette] = useTheme();
    const [_id] = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    //handle our post
    const handlePost = async() => {
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("discription", post);
        
        if (image) {
            formData.append("picture", image);
            formData.append("picturePath", image.name);
        }

        const response = await fetch(`http://localhost:3001/posts`, {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`
        }
        });
        const post = await response.json();
        dispatch(setPost({posts}));
        setImage(null);
        setPost("");
    }

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath} />
                <InputBase 
                placeholder="What's on your mind..."
                onChange={(e) => setPost(e.target.value)}
                value={post}
                sx={{
                    width: "100%",
                    backgroundColor: palette.neutral.light,
                    borderRadius: "2rem",
                    padding: "1rem 2rem",
                }}
                />
            </FlexBetween>
            {isImage && (
                <Box
                borderRadius="5px"
                border={`1px solid ${medium}`}
                mt="1rem"
                p="1rem"
                >
                    <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setImage(acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                        <FlexBetween>
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        width="100%"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!image ? (
                          <p>Add Image Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{image.name}</Typography>
                            <EditOutlined />
                          </FlexBetween>
                        )}
                      </Box>
                      {image && (
                        <IconButton
                        onClick={() => setImage(null)}
                        sx={{width: "15px"}}
                        >

                        </IconButton>
                      )}
                      </FlexBetween>
                    )}
                    </Dropzone>
                </Box>
            )}
            <Divder sx={{margin: "1.25rem 0"}} />

            <FlexBetween>
                <FlexBetween gap = "0.25rem" onClick={() => setIsImage(!isImage)}>
                    <ImageOutlined sx={{color: mediumMain}} />
                    <Typography
                    color={mediumMain}
                    sx={{"&:hover": {cursor: "pointer", color: medium}}}
                    >
                        Image
                    </Typography>
                </FlexBetween>
                {isNonMobileScreens ? ( // where we add icons for making a post. !! can delete in the future!!
                    <>
                    <FlexBetween gap="0.25rem">
                        <GifBoxOutlined sx={{color: mediumMain}} />
                        <Typography color ={mediumMain}>Clip</Typography>
                    </FlexBetween>
                    <FlexBetween gap="0.25rem">
                        <AttatchFileOutlined sx={{color: mediumMain}} />
                        <Typography color ={mediumMain}>Attatchment</Typography>
                    </FlexBetween>
                    <FlexBetween gap="0.25rem">
                        <MicOutlined sx={{color: mediumMain}} />
                        <Typography color ={mediumMain}>Audio</Typography>
                    </FlexBetween>
                    </>
                ): (<><FlexBetween gap="0.25rem">
                    <MoreHorizOutlined sx={{color: mediumMain}}></MoreHorizOutlined>
                    </FlexBetween></>
                )}

                    <Button
                    disabled={!post}
                    onClick={handlePost}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRaidus: "0.3rem"
                    }}
                    >
                        POST
                    </Button>
            </FlexBetween>
        </WidgetWrapper>
    )
}

export default MyPostWidget;