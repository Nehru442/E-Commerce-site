import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  const [state, setState] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const url =
        state === "register"
          ? "/api/user/register"
          : "/api/user/login";

      const payload =
        state === "register"
          ? { name, email, password }
          : { email, password };

      const { data } = await axios.post(url, payload);

      if (data.success) {
        // ✅ STORE TOKEN CORRECTLY
        localStorage.setItem("userToken", data.token);

        // ✅ ATTACH TOKEN TO ALL FUTURE REQUESTS
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;

        // ✅ SET USER STATE
        setUser(data.user);

        toast.success(
          state === "register"
            ? "Account created successfully"
            : "Login successful"
        );

        setShowUserLogin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 left-0 right-0 bottom-0 z-30 flex items-center justify-center bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-80 sm:w-[360px] p-8 rounded-lg shadow-xl flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Register"}
        </h2>

        {state === "register" && (
          <div>
            <label className="text-sm">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        )}

        <div>
          <label className="text-sm">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="text-sm">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white py-2 rounded hover:bg-primary-dull transition"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>

        <p className="text-sm text-center">
          {state === "register" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-primary cursor-pointer"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-primary cursor-pointer"
              >
                Register
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
