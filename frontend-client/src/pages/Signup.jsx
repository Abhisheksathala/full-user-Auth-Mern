import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import OAuth from "../Componenets/OAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  singInstart,
  signInsuccess,
  signInfailure,
} from "../../redux/userSlice";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.user);

  const Submithandle = async (e) => {
    e.preventDefault();
    dispatch(singInstart());
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/signup",
        formData
      );

      if (response.data.success) {
        setFormData({
          username: "",
          email: "",
          password: "",
        });
        dispatch(signInsuccess());
        window.location.href = "/signin";
      }
    } catch (error) {
      dispatch(signInfailure(error.message || "Sign up failed!"));
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Sign up
        </Typography>
        <form noValidate onSubmit={Submithandle}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Name"
            name="username"
            autoComplete="name"
            autoFocus
            onChange={handleChange}
            value={formData.username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={handleChange}
            value={formData.email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            value={formData.password}
          />
          <Button
            disabled={loading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: "24px 0 16px" }}
          >
            Sign up
          </Button>

          <OAuth />

          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            href="/signin" // Change this to your actual sign-in route
          >
            Sign in
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
