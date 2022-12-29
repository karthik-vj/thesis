import React from 'react';
import axios from 'axios';
import qs from 'qs';

import Sidebar from '../Sidebar/Sidebar';
import './ViewResults.css';

export default class ViewResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            quiz: null
        }
    }

    componentDidMount() {
        if (!localStorage.getItem("_ID")) {
            this.props.history.push('/');
            localStorage.clear();
        } else {
            let id = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).id;
            if (!id) {
                this.props.history.push('/');
                console.log('didnt work')
            } else {
                axios.get('/api/quizzes/results/' + id).then(res => {
                    console.log(res.data)
                    this.setState({ result: res.data.score, quiz: res.data.quiz})
                })
            }
        }
       
    }

    getBorderLeft = idx => {
        if (this.state.result.answers[idx]) {
            return '5px solid green';
        } else {
            return '5px solid red';
        }
    }

    getScore = () => {
        let len = this.state.result.answers.length;
        let pass = this.state.quiz.passGrade;
        let right = this.state.result.answers.filter(ans => ans === true);
        let score = 10 * (right.length / len);
        console.log(pass,score)
         return(score)
        //update new calc: newScore = oldScore + (1 - oldScore)* presentScore 
        // AccountScore : oldScore
        //compare with pass grade
    }
    updateScore = ()=>{
        /* axios.put("/api/quizzes/save-result",{
            accountResult : this.getScore()
            }).then(res =>
            {if(res.data)
                {console.log(res)}
            })
        let acc = this.state.result.accountResult
        let presentScore = this.getScore()
        let newScore = acc + ( 10 - acc)* presentScore
        return newScore*/
        this.props.history.push('/dashboard')
    }
    
    render() {
        return (
            <div className="view-results-wrapper">
                <div>
                    <Sidebar />
                </div>
                {(this.state.quiz && this.state.result) && 
                    <div className="body">
                        <div className="header">
                            Quiz Results 
                        </div>
                        <div className="quiz-data">
                            <div className="left">
                                <div className="header">{this.state.quiz.name}</div>
                                <div className="category">{this.state.quiz.category}</div>
                                <div className="comments">{this.state.quiz.comments.length} Comments</div>
                            </div>
                            <div className="right">
                                <div className="likes">{this.state.quiz.likes} Likes</div>
                                <div className="others">{this.state.quiz.scores.length} Other people have taken this quiz</div>
                                
                            </div>
                        </div>

                        <div className="score">
                            {this.getScore() >= this.state.quiz.passGrade ?
                          <div> Score: You Passed and Your Score is {this.getScore()}</div>: <div>Score: Better Luck Next Time, Your Score is {this.getScore()}</div> }
                        </div>

                        <div className="answers"> 
                            {this.state.quiz.questions.map((q, idx) => (
                                <div key={idx} className="answer" style={{borderLeft: this.getBorderLeft(idx)}}>
                                    <div>{q.questionName}</div>
                                </div> 
                            ))}
                        </div>

                        <div className="img">
                            <img src={this.state.quiz.imgUrl ? this.state.quiz.imgUrl : 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'} />
                        </div>
                        <div>
                        <button className='take-quiz-button' onClick={this.updateScore}>Account</button>
                        </div>
                    </div>
                    
                }
            </div>
        )
    }
}