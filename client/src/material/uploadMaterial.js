import { Box, Button, Checkbox, Container, FormHelperText, Link, Grid, TextField, Typography, InputLabel, FormControl, Select, MenuItem, OutlinedInput } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router";
import { UploadMaterial } from '../services/materialApis';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function Material(props) {

    const user = useSelector(state => state.user);

    const today = new Date();

    const navigate = useNavigate();

    const [file, fileChange] = useState();

    // form controller
    const formik = useFormik({

        // intial values
        initialValues: {
            title: '',
            description: '',
            Attach: '',
            Classid: '',
        },

        // To check enter value is vaild or not 
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            // discription: Yup.string().required("Description is required"),
        }),

        // for when click on submit button  
        onSubmit: async (values) => {
            // console.log("Data");
            // console.log(values);

            //Request Body To Pass Api
            const formData = new FormData();
            console.log(file)
            formData.append("file", file);
            formData.append("upload_preset", "classroom_preset");

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/djj0dl6dz/image/upload`,
                {
                    method: "post",
                    body: formData,
                }
            );

            let urlData = await response.json();
            urlData = urlData?.url;
            console.log(urlData);

            const RequestBody = {
                user_Id: user._id,
                Title: values.title,
                Description: values.description,
                Attach: urlData,
                Classid: props.class_id
            }

            try {
                // call to backend url
                console.log(file)
                const response = await UploadMaterial(RequestBody);

                //  status of respose 
                if (response.status === 200) {
                    toast.success("Material Upload Successfully");
                    console.log(response.data);
                    navigate('/');
                }

            } catch (err) {
                toast.error(err.message);
                console.log(err.message);
            }
        }
    });


    return (
        <>

            <Box md={{ Width: '100%' }} sx={{ alignItems: 'center', display: 'flex', flexGrow: 1, minHeight: '100%' }} >
                <Container>

                    {/* <form onSubmit={formik.handleSubmit} action="/uploadphoto" enctype="multipart/form-data" method="POST" > */}
                    <form onSubmit={formik.handleSubmit}>
                        {/* <Box sx={{ my: 3 }}>
                            <Typography color="textPrimary" variant="h4" > Material </Typography>
                        </Box> */}

                        <Grid container spacing={0}>


                            <Grid item xs={12} md={0} >
                                {/* Title */}
                                <TextField
                                    error={Boolean(formik.touched.title && formik.errors.title)}
                                    // fullWidth
                                    helperText={formik.touched.title && formik.errors.title}
                                    label="Title"
                                    margin="normal"
                                    name="title"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.title}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} md={0} >
                                {/* Description */}
                                <TextField
                                    error={Boolean(formik.touched.description && formik.errors.description)}
                                    fullWidth
                                    helperText={formik.touched.description && formik.errors.description}
                                    label="Description"
                                    margin="normal"
                                    name="description"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    value={formik.values.image}
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        fileChange(e.target.files[0])
                                    }}
                                />

                            </Grid>

                        </Grid>

                        <Box sx={{ py: 2 }}>
                            {/* Submit btn */}
                            <Button color="primary" disabled={formik.isSubmitting} size="large" type="submit" sx={{ marginRight: '5px' }} variant="contained" >
                                Post
                            </Button>
                            {/* Cancle btn */}
                            <Button color="error" onClick={() => props.SetopenUplaodFormCallBack(0) } size="large" type="submit" variant="contained" >
                                Cancle
                            </Button>
                        </Box>
                    </form>


                </Container>
            </Box>
        </>
    );

}

export default Material;

