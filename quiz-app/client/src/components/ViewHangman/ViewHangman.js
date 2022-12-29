import React from 'react';
import './ViewHangman.css';
import qs from 'qs';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class ViewQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            hangman: {},
            isLoading: true, 
            isAuthenticated: true, 
            inputVal: ''
        }
    }

    checkAuth = () => {
        if (this.state.hangman.mustBeSigned && localStorage.getItem('JWT_PAYLOAD') && localStorage.getItem('_ID')) {
            this.setState({isAuthenticated: true})
        } else if (this.state.hangman.mustBeSigned) {
            this.setState({isAuthenticated: false});
        }
        
    }

    componentDidMount() {
       let id = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).id;
        this.setState({ id: id });
        this.refreshQuiz();
          console.log(this.state.hangman)
    }

    refreshQuiz = () => {
        axios.get('/api/hangmans/get-hangman/' + qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).id).then(res => {
            if (res.data) {
                this.setState({isLoading: false, hangman: res.data.hangman});
                localStorage.setItem('questions' ,JSON.stringify (res.data.hangman))
                this.checkAuth();
                console.log(res.data.hangman)
                console.log(this.state.hangman)
                console.log(localStorage)
            }
        }).catch(er => {
            console.log(er);
        })
    }

    startQuiz = () => {
        this.props.history.push({ 
            pathname: "/take-hangman/" + this.state.id,
            state: {
                hangman: this.state.hangman
            }
        })
    } 

    render() {
        
        return !this.state.isLoading ? (
            <div className="view-quiz">
                {!this.state.isAuthenticated ? <div className="not-auth">You must be logged in to take this quiz</div> : 
                <div className="content">
                    <div className="header">
                        {this.state.hangman.name}
                    </div>
                    <div className="body">
                        <div className="left">
                            <div className="description">{this.state.hangman.description}</div>
                        </div>
                        <div className="right">
                            <div className="questions-num">{this.state.hangman.questions.length} Questions</div>
                            <div className={this.state.hangman.createdBy === localStorage.getItem('_ID') ? 'questions-wrapper' : 'questions-wrapper no-scroll'}>
                                {this.state.hangman.questions.map((question, idx) => (
                                    <div className="question" key={idx}>
                                        <div>{this.state.hangman.createdBy === localStorage.getItem('_ID') ? question.questionName : 'question name'}</div>
                                        <div>{this.state.hangman.createdBy === localStorage.getItem('_ID') ? question.correctAnswer : 'answer'}</div>
                                    </div>
                                ))}
                                {this.state.hangman.createdBy !== localStorage.getItem('_ID') ? <div className="hidden"><div>Must be creator to look at questions</div></div> : ''}
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="buttons-wrapper">
                            <button onClick={() => this.props.history.goBack()}>Go Back</button>
                            <button onClick={this.startQuiz}>Take Quiz</button>
                        </div>
                    </div>
                </div>
                }
            </div>
        ) : <h2>Loading</h2>
    }
}