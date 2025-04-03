import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={loginWithGoogle} className="btn btn-primary">
        Login with Google
      </button>
    </div>
  );
}
