import { useState, useEffect, useRef } from "react";
import Login from "../components/authentication/Login";
import Register from "../components/authentication/Register";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { selectAppState } from "../store/slices/AppSlice";
import { selectFormfieldState } from "../store/slices/FormfieldSlice";
import type { UserType } from "../utils/AppTypes";
import { useAppSelector } from "../store/storeHooks";

const HomePage = () => {
  const { loggedInUser } = useAppSelector(selectAppState);
  const { disableIfLoading } = useAppSelector(selectFormfieldState);

  const [showLogin, setShowLogin] = useState(true);
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    // localStorage persists data even after page refresh, unlike state
    const user: UserType = JSON.parse(
      localStorage.getItem("loggedInUser") as string
    );
    if (user && Date.now() < user.expiryTime) navigate("/chats");
  }, []);

  return (
    <>
      {!loggedInUser && (
        <section className="homepage container-fluid d-flex flex-column p-4" style={{ marginTop: '27vh' }}>
          <section className="homepage__header container pt-0 pb-2 ps-1 pe-4 mb-2 user-select-none">
            <span className="d-inline-block mt-2" style={{color: 'white'}}>Real-Time Chat</span>
          </section>
          <section
            className={`app__body container p-2 mb-2 ${disableIfLoading}`}
          >
            <div className="container d-flex justify-content-between">
              <button
                className={`app__btnToggle fs-4 btn ${
                  showLogin ? "btn-primary" : "text-light"
                } rounded-pill col m-1 ${disableIfLoading}`}
                onMouseDown={() => setShowLogin(true)}
              >
                Login
              </button>
              <button
                className={`app__btnToggle fs-4 btn ${
                  showLogin ? "text-light" : "btn-primary"
                } rounded-pill col m-1 ${disableIfLoading}`}
                onMouseDown={() => setShowLogin(false)}
              >
                Register
              </button>
            </div>
            <section
              className={`app__form container text-light p-2 ${disableIfLoading}`}
            >
              {showLogin ? <Login /> : <Register />}
            </section>
          </section>
        </section>
      )}
      
    </>
  );
};

export default HomePage;
