import React from "react";
import { SubmitAssignmentApiCall } from "../services/assignmentApis";
import { useState } from "react";
import { useFormik } from 'formik';
import { Box, Button, Checkbox, Container, FormHelperText, Link, Grid, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useNavigate, useParams } from "react-router";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function StudentUploadAssignment(props) {

  const AssignmentId = props.AssignmentId;

  const [file, fileChange] = useState();

  const navigate = useNavigate();

  const user = useSelector(state => state.user);

  // form controller
  const formik = useFormik({

    // intial values
    initialValues: {
        Points: 0,
        Attach: '',
    },

    // To check enter value is vaild or not 
    validationSchema: Yup.object({
    }),

    // for when click on submit button  
    onSubmit: async (values) => {

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

        const date1 = new Date();
        console.log(date1);
        const isoDate = date1.toISOString();
        console.log(isoDate);

        const RequestBody = {
            Points: 0,
            Attach: urlData,
            userId : user._id,
            userUserId : user.userId,
            DateWhenAssign : isoDate
        }

        try {
            // call to backend url
            console.log(file)
            const response = await SubmitAssignmentApiCall(AssignmentId,RequestBody);

            //  status of respose 
            if (response.status === 200) {
                toast.success("Assigment Upload Successfully");
                console.log(response.data);
                // navigate('/');
            }

        } catch (err) {
            toast.error(err.message);
            console.log(err.message);
        }
      }
  });

  return (
    <>

        <Box md={{ Width: '100%' }} sx={{ alignItems: 'center', display: 'flex' }} >
            <Container>

                {/* <form onSubmit={formik.handleSubmit} action="/uploadphoto" enctype="multipart/form-data" method="POST" > */}
                <form onSubmit={formik.handleSubmit}>
                    {/* <Box sx={{ my: 3 }}>
                        <Typography color="textPrimary" variant="h4" > Assigment </Typography>
                    </Box> */}

                    <Grid container spacing={2}>

                        <Grid item xs={12} md={6}>
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
                        <Button color="primary" disabled={formik.isSubmitting} size="large" sx={{ marginRight: '5px' }} type="submit" variant="contained" >
                            Hand In
                        </Button>
                    </Box>

                </form>
            </Container>
        </Box>
    </>
);

}

