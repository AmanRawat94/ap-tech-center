import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFormGoogle = await signInWithPopup(auth, provider);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: resultsFormGoogle.user.displayName,
            email: resultsFormGoogle.user.email,
            googlephotoURL: resultsFormGoogle.user.photoURL,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("access_token", data.token);
        dispatch(signInSuccess(data.rest));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button type="button" gradientDuoTone="pinkToOrange" onClick={handleGoogle}>
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue With Google
    </Button>
  );
};

export default OAuth;
