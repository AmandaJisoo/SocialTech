import { BrowserRouter, Route, Routes, useHistory } from "react-router-dom"
import './App.css';
import CustomButton from "./components/Button";
import Button from '@mui/material/Button';
import styles from "./styles/buttonStyle";
import { ThemeProvider } from "@mui/material";
import appThemeMui from "./theme/appThemeMui";
import Onboard from "./pages/Onboard";
import ShelterList from "./pages/ShelterList";
import ShelterDetail from "./pages/ShelterCardDetail";
import Auth from "./pages/Auth/Auth";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";


const App = () => {

  return (
    <>
      <ThemeProvider theme={appThemeMui}>
        <Routes>

          <Route index path="/app/dashboard" element={
            <ShelterList/>
          } />

          <Route path="/app/auth" element={<Auth/>}>
            <Route path="sign-up" element={
              <SignUp />
            } />
            <Route path="sign-in" element={
              <SignIn/>
            } />    
          </Route>

          <Route exact path="/app/onboard" element={
            <Onboard/>
          } />
          <Route path="app/shelter-list" element={
            <ShelterList/>
          } />
          <Route path="app/shelter-detail" element={
            <ShelterDetail/>
          } />

          <Route path="*" element={
            <div className="no-match"></div>
          } />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
