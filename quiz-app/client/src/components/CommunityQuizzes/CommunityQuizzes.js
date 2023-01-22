import React from 'react';
import Sidebar from '../Sidebar/Sidebar2';
import axios from 'axios';
import './CommunityQuizzes.css';
import Toast from '../Toast/Toast';
import Dialog from '../Dialog/dialog';

export default class CommunityQuizzes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizzes: [],
            showToast: false,
            message: '',
            addQuestion: false,
            name:'',
            concept:'',
            conceptDescription: ''
        }
    }

    componentDidMount() {
        axios.get('/api/quizzes/all-quizzes').then(res => {
            console.log(res.data)
            this.setState({
                quizzes: res.data
            })
        })
    }

    likeQuiz = (quizId) => {
        axios.post('/api/quizzes/like-quiz', {quizId: quizId, userId: localStorage.getItem('_ID')}).then(res => {
            if (res.data) {
                this.setState({showToast: true, message: res.data.message});
                axios.get('/api/quizzes/all-quizzes').then(res => {
                    this.setState({
                        quizzes: res.data
                    })
                })
                setTimeout(() => {
                    this.setState({showToast: false, message: res.data.message});
                }, 3000);
            }
        })
        console.log(quizId)
    }

    takeQuiz = (quizId) => {
        this.props.history.push('/view-quiz?id=' + quizId);
    }

    render() {
        return (
            <div className="community-quizzes-wrapper">
                <Toast model={this.state.showToast} message={this.state.message} />
                <div>
                    <Sidebar />
                </div>
                <div className="body">
                    <div className="header-top">Community Quizzes</div>
                    <div className="quizzes-wrapper">
                        {this.state.quizzes.map((quiz, idx) => (
                            <div key={idx} className="quiz-card card">
                                <img src={quiz.imgUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'} />
                                <div className="quiz-name">{quiz.name}</div>
                                <div className="category">{quiz.category}</div>
                                <div className="questions">{quiz.questions.length} Questions</div>
                                <div className="take-quiz btn" onClick={() => this.takeQuiz(quiz._id)}>Play</div>
                                <div className="take-quiz btn"onClick={() => this.setState({ addQuestion: true, name: quiz.name,concept: quiz.concept,conceptDescription: quiz.conceptDescription})}>Info </div>
                        
                                <div className="top-section">
                                    <div className="likes">{quiz.likes} <img style={{cursor: 'pointer', padding: '5px'}} onClick={() => this.likeQuiz(quiz._id)} src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-512.png" /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Dialog model={this.state.addQuestion}>
          <div className="new-question-form">
            <div className="input-field">
              <div style={{ display: "flex", flexDirection: "column" }}><h2 style={{ padding: "10px 20px", textAlign: "center", color: "Black" }}>
                Details
              </h2></div>
              <h3>{this.state.name}</h3><br></br>
              <div>{this.state.concept}</div><br></br>
              <div>{this.state.conceptDescription}</div><br></br>
              <br></br><div className="btn" onClick={() => this.setState({ addQuestion: false })}>Close</div><br></br>
            </div>
          </div>
        </Dialog>
                </div>
            </div>
        )
    }
}