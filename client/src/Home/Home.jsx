import React from "react";
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleLybrary = (name) => {
        navigate(`/${name}`);
    };

    return (
        <div className="homepage">
            <button className="button b1">Home</button>
            <button className="button b1" style={{ margin: "2px" }} onClick={() => handleLybrary('books1')}>Lybrary</button>
            <button className="button b1" style={{ margin: "2px" }} onClick={() => handleLybrary('books2')}>Lybrary MRT-V2</button>
        </div>
    );
};

export default Home;
