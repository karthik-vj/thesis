import React from 'react';
import axios from 'axios';
import qs from 'qs';

import Sidebar from '../Sidebar/Sidebar2';
import './ViewResults.css';

export default class ViewResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            hangman: null,
            score: 0
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
                console.log('id',id)
            } else {
                axios.get('/api/hangmans/results/' + id).then(res => {
                   console.log(res.data)
                   this.setState({ result: res.data.score, hangman: res.data.hangman})
                }).catch(er=>{ console.log(er.response.data) })
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
        let pass = this.state.hangman.passGrade;
        let right = this.state.result.answers.filter(ans => ans === true);
        let score = 10 * (right.length / len);
        this.setState({score: score})
         return(score)
    }
    updateScore = ()=>{
        let id = this.state.result._id
        let accountResult = this.state.score
        axios.put("/api/hangmans/update-results/"+id,{accountResult: accountResult}).then(res =>
            {
                if(res.data)
            {
                console.log(res)
            }
            }).catch((err) => { console.log(err.response.data) })
        this.props.history.push('/dashboard')
    }
    
    render() {
        return (
            <div className="view-results-wrapper">
                
                {(this.state.hangman && this.state.result) && 
                    <div className="body">
                        <div className="header">
                            Hangman Results 
                        </div>
                        <div className="quiz-data">
                            <div className="left">
                                <div className="header">{this.state.hangman.name}</div>
                                <div className="category">{this.state.hangman.category}</div>
                                
                            </div>
                        </div>

                        <div className="score">
                            {this.getScore() >= this.state.hangman.passGrade ?
                          <div> Score: You Passed and Your Score is {this.getScore()}</div>: <div>Score: Better Luck Next Time, Your Score is {this.getScore()}</div> }
                        </div>

                        <div className="answers"> 
                            {this.state.hangman.questions.map((q, idx) => (
                                <div key={idx} className="answer" style={{borderLeft: this.getBorderLeft(idx)}}>
                                    <div>{q.questionName}</div>
                                </div> 
                            ))}
                        </div>

                        <div className="img">
                            <img src={this.state.hangman.imgUrl ? this.state.hangman.imgUrl : 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'} />
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