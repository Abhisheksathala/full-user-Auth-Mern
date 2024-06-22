import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../Firebase";
import axios from "axios";
import {
  updateUserStart,
  signInsuccess,
  signInfailure,
} from "../../redux/userSlice";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [imagePer, setImagePer] = useState(0); // Initialize to 0 for progress
  const [imageerror, setImageerror] = useState(null);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  useEffect(() => {
    if (image) {
      handleFileupload(image);
    }
  }, [image]);

  const handleFileupload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setImagePer(progress);
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        setImageerror(`Upload error: ${error.message}`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setFormData((prevData) => ({
              ...prevData,
              profilePic: downloadURL,
            }));
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            setImageerror(`Error getting download URL: ${error.message}`);
          });
      }
    );
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      // Retrieve token from localStorage
      const token = localStorage.getItem("access_token");
      console.log("Token:", token); // Add this line to check token value

      // Check if token exists
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `http://localhost:4000/api/v1/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(signInsuccess(response.data));
        setSuccess(true);
        setError(null);
      } else {
        dispatch(signInfailure("Update failed"));
        setError("Update failed");
        setSuccess(false);
      }

      console.log(response.data);
    } catch (error) {
      dispatch(signInfailure(error.message));
      setError(error.message);
      setSuccess(false);
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("access-token");
      console.log("Token:", token);

      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.delete(
        `http://localhost:4000/api/v1/user/delete/${currentUser._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setError(null);
        // Add any additional logic for successful account deletion
      } else {
        setError("Account deletion failed");
        setSuccess(false);
      }
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form
        onSubmit={handleSubmit}
        action=""
        className="flex flex-col pt-3 py-3 w-1/3 justify-center "
      >
        <label htmlFor="">
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </label>
        <img
          className="rounded-full mb-2 cursor-pointer h-28 w-28 object-cover bg-gray-200 self-center"
          src={formData.profilePic || currentUser.profilePic}
          alt="Profile"
          onClick={() => {
            fileRef.current.click();
          }}
        />
        {
          // Image upload progress or error message
          imageerror ? (
            <p className="text-red-500">{imageerror}</p>
          ) : (
            <p className="text-blue-300">{imagePer}%</p>
          )
        }
        <input
          type="text"
          name="username"
          placeholder="Enter your name"
          className="rounded-lg pt-3 py-3 mb-2 bg-slate-100"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="rounded-lg pt-3 py-3 mb-2 bg-slate-100"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          className="rounded-lg mb-2 pt-3 py-3 bg-slate-100"
        />
        <button className="hover:opacity-85 bg-blue-600 p-3">Update</button>
      </form>
      <div className="flex justify-between mt-5 w-[33%]">
        <Button onClick={handleDeleteAccount} variant="contained" color="error">
          Delete
        </Button>
        <Button variant="contained" color="error">
          SignOut
        </Button>
      </div>
      {error && (
        <div className="text-red-700 text-center mt-5">Error: {error}</div>
      )}
      {success && (
        <div className="text-green-700 text-center mt-5">
          User updated successfully
        </div>
      )}
    </div>
  );
};

export default Profile;
