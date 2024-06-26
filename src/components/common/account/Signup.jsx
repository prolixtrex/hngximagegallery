import { useState, useContext } from "react";
import { DataContext } from "../../../dataContext/DataContext";
import { Link, useNavigate } from "react-router-dom";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    updateEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDb } from "../../../firebase/firebase";
import LoadingIndicator from "../loading/LoadingIndicator";
import "./account.css";

const Signup = () => {
    const { setUser, setLoggedIn, loading, setLoading } =
        useContext(DataContext);
    const auth = getAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [passwordMissMatch, setPasswordMissMatch] = useState("");

    const [firebaseError, setFirebaseError] = useState(null);

    const handleSignup = (event) => {
        event.preventDefault();
        if (
            firstName !== "" ||
            lastName !== "" ||
            email !== "" ||
            password !== "" ||
            displayName !== ""
        ) {
            if (password !== confirmPassword) {
                setPasswordMissMatch("Passwords do not match");
            } else {
                setLoading("signUp");
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Signed up
                        const user = userCredential.user;
                        setUser(user);
                        createAccountInfo(user.uid);
                        setInfo(user, displayName, email);
                        setLoggedIn(true);
                        navigate("/");
                        setLoading(null);
                        // ...
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        setFirebaseError(errorCode);
                        console.log(errorCode);
                        console.log(errorMessage);
                        // ..
                    });
            }
        }
    };

    const createAccountInfo = async (uid) => {
        const data = {
            firstName:
                firstName.charAt(0).toUpperCase() +
                firstName.slice(1).toLowerCase(),
            lastName:
                lastName.charAt(0).toUpperCase() +
                lastName.slice(1).toLowerCase(),
            email: email,
        };

        await setDoc(doc(firestoreDb, "users", uid), data);
    };

    const setInfo = async (user, displayName, email) => {
        try {
            await updateProfile(user, { displayName });
            await updateEmail(user, { email });
        } catch (error) {
            console.log("error setting info");
        }
    };

    const handleInput = (caller, e) => {
        setFirebaseError("");
        setPasswordMissMatch("");

        switch (caller) {
            case "fName":
                setFirstName(e);
                break;
            case "lName":
                setLastName(e);
                break;
            case "email":
                setEmail(e);
                break;
            case "pWord":
                setPassword(e);
                break;
            case "cpWord":
                setConfirmPassword(e);
                break;
            case "dName":
                setDisplayName(e);
                break;
            default:
                break;
        }
    };

    return (
        <div className="account">
            <div className="accountWrapper">
                {loading === "signUp" && <LoadingIndicator />}
                <div className="accountHeader">
                    <h4>
                        <em>Create your account with Nobfiles</em>
                    </h4>
                </div>
                <div className="accountBody">
                    <form onSubmit={handleSignup}>
                        <div className="erroraccount">
                            {firebaseError && <p>{firebaseError}</p>}
                            {passwordMissMatch && <p>{passwordMissMatch}</p>}
                        </div>
                        <div>
                            <label htmlFor="displayName">Display Name:</label>
                            <input
                                type="text"
                                id="displayName"
                                value={displayName}
                                onChange={(e) =>
                                    handleInput("dName", e.target.value)
                                }
                                autoFocus
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) =>
                                    handleInput("fName", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) =>
                                    handleInput("lName", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) =>
                                    handleInput("email", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) =>
                                    handleInput("pWord", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">
                                Confirm Password:
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) =>
                                    handleInput("cpWord", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <input type="submit" value="Signup" id="submit" />
                        </div>
                    </form>
                </div>
                <div className="accountFooter">
                    <i>
                        have an account? <Link to="/">login</Link> instead.
                    </i>
                </div>
            </div>
        </div>
    );
};

export default Signup;
