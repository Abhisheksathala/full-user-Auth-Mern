import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";

const NavigationBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log("Current User:", currentUser);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Maha
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
        <Button color="inherit" component={Link} to="/signup">
          Sign Up
        </Button>
        {currentUser && currentUser.profilePic ? (
          <Button color="inherit" component={Link} to="/profile">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={currentUser.profilePic}
                alt="Profile"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  marginLeft: 10,
                }}
              />
            </Box>
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/signin">
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
