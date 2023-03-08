import { Route,BrowserRouter,Routes, useNavigate, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./page/Login";
import SignUp from "./page/SignUp";
import { Auth } from "./context/AuthContext";
import { useContext } from "react";
import Message from "./components/Message";

function App() {
  const {user} = useContext(Auth)
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={user ? 
        <div className="App flex flex-col h-screen">
          <Header />
          <Message />
        </div> : <Navigate to={'/login'}/>
      }
      />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={'/'}/>}/>
      <Route path="/signup" element={!user ? <SignUp /> : <Navigate to={'/'}/>}/>


    </Routes>
    </BrowserRouter>
  );
}

export default App;
