import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from '../Pages/LoginSignup';
import StudentForm from '../Pages/Form';
import Dashboard from '../Pages/Dashboard';
import StudentCard from '../Pages/StudentCard';
import Navbar from '../componenets/Navbar'; // Import Navbar
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import '../Pages/styles.css';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcaoVIzjoQIwAJ_9m_zxBcjPcWBjuSmBk",
    authDomain: "sign-up-login-page-af63e.firebaseapp.com",
    projectId: "sign-up-login-page-af63e",
    storageBucket: "sign-up-login-page-af63e.firebasestorage.app",
    messagingSenderId: "287209245759",
    appId: "1:287209245759:web:f70c09d0b6326e5d277c8a",
    measurementId: "G-HRDDHHJE3X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function MyRoutes() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    if (loading) {
        return <div className="loading-full">Loading...</div>;
    }

    return (
        <BrowserRouter>

            {user && <Navbar />}

            <div className={`content-wrapper ${user ? 'with-navbar' : ''}`}>
                <Routes>
                    <Route
                        path='/'
                        element={user ? <Navigate to="/dashboard" /> : <Login />}
                    />
                    <Route
                        path='/dashboard'
                        element={user ? <Dashboard /> : <Navigate to="/" />}
                    />
                    <Route
                        path='/form'
                        element={user ? <StudentForm /> : <Navigate to="/" />}
                    />
                    <Route
                        path='/student/:id'
                        element={user ? <StudentCard /> : <Navigate to="/" />}
                    />
                    <Route
                        path='/my-card'
                        element={user ? <StudentCard /> : <Navigate to="/" />}
                    />
                    <Route path='*' element={<Navigate to="/" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default MyRoutes;