import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleProfile = () => {
        navigate('/profile');
    }

    return (
        <div className="Navbar">
            <div className="navbar">
                <div className="navbar-left">
                    <div className="logo">BrabdLabs</div>
                </div>
                <div className="navbar-right">
                    <FaUserCircle className="user-icon" onClick={handleProfile}/>
                    <span>Jay Kumar</span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
