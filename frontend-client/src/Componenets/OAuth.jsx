import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { Button } from "@mui/material";
import { app } from "../Firebase"; // Ensure you are importing your firebase config
import axios from "axios";
import {
  singInstart,
  signInsuccess,
  signInfailure,
  updateUserStart,
} from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// OAuth component for Google sign in
const OAuth = () => {
  const dispatch = useDispatch();

  // Handle Google sign in click event
  const handleGoogleClick = async (e) => {
    e.preventDefault();

    try {
      dispatch(singInstart());

      // Create a new Google auth provider
      const googleProvider = new GoogleAuthProvider();
      // Get the Firebase auth instance
      const auth = getAuth();
      // Sign in with Google using the popup method
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email, photoURL } = result.user;
      // Make an API request using Axios
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/google",
        {
          username: displayName,
          email,
          profilePic: photoURL, // Pass the photoURL as profilePic
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        dispatch(signInsuccess(response.data));
        localStorage.setItem("access-token", response.data.token);

        console.log("Token stored in local storage:", response.data.token);
        // Redirect to a protected route or home page
        console.log("API response:", response.data);
        setTimeout(() => {
          window.location.replace("/");
        }, 5000);
      } else {
        dispatch(signInfailure(response.data));
        console.log("API response:", response.data);
      }
    } catch (error) {
      dispatch(signInfailure());
    }
  };

  // Return a Button component with a click event handler
  return (
    <Button
      fullWidth
      variant="contained"
      color="error"
      style={{ margin: "24px 0 16px" }}
      type="button"
      onClick={handleGoogleClick}
    >
      Continue with Google
    </Button>
  );
};

export default OAuth;
