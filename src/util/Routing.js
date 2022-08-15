
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
import Login from '../pages/Login'
import Section from "../pages/Section";
import Student from "../pages/Student";
import Teacher from "../pages/Teacher";

//Routing JS
function Routing() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/trackeradmin" element={<AdminPage />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/teacher/section" element={<Section />} />
    </Routes>
  );
}

export default Routing;
