import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import AboutPage from "@/pages/about";
import DefaultLayout from "./layouts/default";
import ProfilePage from "./pages/profile";
import ProfileDetail from "./pages/profileDetail";
import UpdateProfile from "./pages/update";

function App() {
  return (
    <DefaultLayout>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<ProfilePage />} path="/profile" />
        <Route element={<ProfileDetail />} path="/profileDetail" />
        <Route element={<UpdateProfile />} path="/update" />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
