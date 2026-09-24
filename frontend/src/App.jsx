import { useState } from "react";
import SignIn from "./pages/SignIn";
import Login from "./pages/login";

function App() {
  const [screen, setScreen] = useState("login");

  return (
    <div>
      {screen === "login" ? (
        <Login onCreateAccount={() => setScreen("sign-in")} />
      ) : (
        <SignIn
          onGoToLogin={() => setScreen("login")}
          onSignedIn={() => setScreen("login")}
        />
      )}
    </div>
  );
}

export default App;
