import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import './MyQuizzes.css';

export default class MyQuizzes extends React.Component {

    render() {
        return (
            <div className="my-quizzes-wrapper">
                <div>
                    <Sidebar />
                </div>
                </div>
         )       
    }            
}