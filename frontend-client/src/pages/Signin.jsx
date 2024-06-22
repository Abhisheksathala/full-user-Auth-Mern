import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  singInstart,
  signInsuccess,
  signInfailure,
} from "../../redux/userSlice";

function SignIn() {
  const [formData, setFormData] = useState({
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
        "http://localhost:4000/api/v1/user/signin",
        formData
      );
      console.log("Response data:", response.data);
      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem("access-token", response.data.token);
          console.log("Token stored:", localStorage.getItem("access-token")); // Verify the token is stored
        } else {
          console.error("Token not found in the response");
        }
        setFormData({
          email: "",
          password: "",
        });
        dispatch(signInsuccess(response.data));
        window.location.href = "/"; // Redirect to the home page
      }
    } catch (error) {
      dispatch(
        signInfailure(error.response?.data?.message || "Something went wrong")
      );
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
          Sign In
        </Typography>
        <form noValidate onSubmit={Submithandle}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
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
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: "24px 0 16px" }}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Signing In..." : "Sign In"}{" "}
            {/* Show loading text if loading */}
          </Button>
          <p>Don't have an account?</p>
          <Button fullWidth variant="outlined" color="secondary" href="/signup">
            Sign Up
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
        </form>
      </Box>
    </Container>
  );
}

export default SignIn;
