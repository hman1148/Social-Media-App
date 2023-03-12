// registration functionality 
import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
} from "@mui/material";
import { ModeEditOutline } from "@mui/icons-material/EditAttributesOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone"; //allows user to upload image
import FlexBetween from "../../components/FlexBetween";


// yup validation schema. basically what the user needs to enter in order ot register an account
const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"), // these attributes validate all the inputs check yup library for specific email type
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"), 
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
    email: yup.string().required("required"),
    password: yup.string().required("required"),
});

const initalValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
}

const initialValuesLogin = {
    email: "",
    password: ""
}

const Form = () => {

    const [pageType, setPageType] = useState("Login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    // send data to the backend for registering a user
    const register = async(values, onSubmitProps) => {
        // this allows us to send form info with image to the backend
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value]);
        }
        formData.append('picturePath', values.picture.name);

        const saveUserResponse = await fetch(
            "https://localhost:3001/auth/register",
            {
                method: "POST",
                body: formData
            }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser) {
            setPageType("login");
        }
    };

    const login = async(values, onSubmitProps) => {
        const loggedInResponse = await fetch(
            "https://localhost:3001/auth/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(values)
            }
        );

        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();

        if (loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token
                })
            )
        }
        navigate("/home");
    }


    const handleFormSubmit = async(values, onSubmitProps) => {
        if (isLogin) {
            await login(values, onSubmitProps);
        } 
        if (isRegister) {
            await register(values, onSubmitProps);
        }
    };
    
    return (
        <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin: initalValuesRegister}
        validationSchema={isLogin ? loginSchema: registerSchema}
        >
            {({ // trippy syntax don't worry about this
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box 
                    display="grid"
                    gap = "30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined: "span 4"} // set the span to 4 if mobile
                        
                    }}
                    >
                        {isRegister && (
                            <>
                            <TextField 
                            label="First Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            name="firstName"
                            error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName} // show the error if we have an error
                            sx={{gridColumn: "span 2"}}
                            />
                            <TextField 
                            label="Last Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            name="lastName"
                            error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName} // show the error if we have an error
                            sx={{gridColumn: "span 2"}}
                            />
                            <TextField 
                            label="Location"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.location}
                            name="location"
                            error={Boolean(touched.location) && Boolean(errors.location)}
                            helperText={touched.location && errors.location} // show the error if we have an error
                            sx={{gridColumn: "span 4"}}
                            />
                            <TextField 
                            label="Occupation"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.occupation}
                            name="occupation"
                            error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                            helperText={touched.occupation && errors.occupation} // show the error if we have an error
                            sx={{gridColumn: "span 4"}}
                            />
                            {/* Inputting Profile Image */}

                            <Box
                            gridColumn="span 4"
                            border={`1px solid ${palette.neutral.medium}`}
                            borderRadius="5px"
                            p="1rem"
                            >
                                <Dropzone
                                accptedFiles=".jpg,.jpeg,.png" // our accepted file types for profile images
                                multiple={false}
                                onDrop={(acceptedFiles) => {
                                    setFieldValue("picture", acceptedFiles[0])
                                }}
                                >
                                    {({getRootProps, getInputProps})=> (
                                        <Box
                                        {...getRootProps()}
                                        border={`2px ${palette.primary.main}`}
                                        p="1rem"
                                        sx={{"&:hover": {cursor: "pointer"}}}
                                        >
                                            <input {...getInputProps()} />
                                            {!values.picture ? (
                                                <p>Add Picture Here</p>
                                            ): (
                                                <FlexBetween>
                                                    <Typography>
                                                        {values.picture.name}
                                                    </Typography>
                                                    <EditOutlinedIcon />  
                                                </FlexBetween>
                                            )}
                                        </Box>
                                    )}
                                </Dropzone>
                            </Box>
                            </>
                        )}
                <TextField 
                 label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email} // show the error if we have an error
                sx={{gridColumn: "span 4"}}
                />
                <TextField 
                 label="Password"
                 type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="email"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password} // show the error if we have an error
                sx={{gridColumn: "span 4"}}
                />

                    </Box>

                    {/* Buttons */}

                    <Box>
                        <Button
                        fullWidth
                        type="submit"
                        sx={{
                            m: "2rem 0", 
                            p: "Item",
                            backgroundColor: palette.primary.main,
                            color: palette.background.alt,
                            "&:hover": {color: palette.primary.main}
                        }}
                        >
                            {isLogin ? "LOGIN": "REGISTER"}
                        </Button>
                        <Typography
                        onClick={() => {
                            setPageType(isLogin ? "register": "login");
                            resetForm();
                        }}
                        sx= {{
                          textDecoration: "underline",
                          color: palette.primary.main,
                          "&:hover": {
                            cursor: "pointer",
                            color: palette.primary.main
                          }
                        }}
                        >
                            {/* Give optinos if the user has or hasn't an account */}
                            {isLogin ? "Don't have an account? Sign up here." : "Already have an account? Login here!"} 
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default Form;