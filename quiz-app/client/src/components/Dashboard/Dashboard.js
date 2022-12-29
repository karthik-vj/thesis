import React from "react";
import './Dashboard.css';
import Sidebar from '../Sidebar/Sidebar';
import qs from 'qs';
import axios from "axios";

export default class Dashboard extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            result: null,
            quiz: null,
            quizzes: [],
            hangman: [],
            tempResult: [],
            quizId:''
        }
    }
    componentDidMount(){
        if(!localStorage.getItem('JWT_PAYLOAD')){
            this.props.history.push('/')
        }
        axios.get('/api/hangmans/all-hangman').then(res => {
            this.setState({
                hangman: res.data
            })
        })
        axios.get('/api/quizzes/all-quizzes').then(res => {
            console.log(res.data)
            this.setState({
                quizzes: res.data
            })
        })
    }
    
    Quiz = (quizId)=>{
        console.log("quiz ids:",quizId)
        console.log("user id",localStorage.getItem("_ID"))

        let userId = localStorage.getItem("_ID")
        axios.get('/api/results/all-result/'+userId,{quizId}).then(res =>{
           console.log(res.data)
        }).catch(er=>{ console.log(er.response.data) })
       
    }
   

    render() {
        return (
            <div className="dashboard-wrapper">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="main">
                    <div className="top">
                        <div className="left">
                            <div className="header">Statistics</div>
                        </div>
                        <div className="right">
                            <div className="header">My Quizzes</div><br></br>
                            <div className="quizzes-wrapper" >
                        {this.state.quizzes.map((quiz, idx) => (
                            <div key={idx} className="quiz-card card">
                                <div className="quiz-name">{quiz.name}</div>
                                <div className="take-quiz btn" onClick={() => this.Quiz(quiz._id)}>Quiz Result</div>
                                <div className="top-section">
                                    <div className="likes"> <img style={{cursor: 'pointer', padding: '5px'}} onClick={() => this.likeQuiz(quiz._id)} /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                        </div>
                    </div>

                    <div className="bottom">
                        
                    </div>
                </div>
            </div>
        )
    }
}