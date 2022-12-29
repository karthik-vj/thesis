import React from 'react';
import Sidebar from '../Sidebar/Sidebar2';
import axios from 'axios';
import './CommunityQuizzes.css';
import Toast from '../Toast/Toast';

export default class CommunityQuizzes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hangman: [],
            showToast: false,
            message: ''
        }
    }

    componentDidMount() {
        axios.get('/api/hangmans/all-hangman').then(res => {
            this.setState({
                hangman: res.data
            })
        })
    }

    takeHangman = (hangmanId) => {
        this.props.history.push('/view-hangman?id=' + hangmanId);
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
                        {this.state.hangman.map((hangman, idx) => (
                            <div key={idx} className="quiz-card card">
                                <img src={hangman.imgUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'} />
                                <div className="quiz-name">{hangman.name}</div>
                                <div className="category">{hangman.category}</div>
                                <div className="skill">{hangman.skills}</div>
                                <div className="questions">{hangman.questions.length} Questions</div>
                                <div className="take-quiz btn" onClick={() => this.takeHangman(hangman._id)}>Take Quiz</div>

                                <div className="top-section">
                                    <div className="likes">{hangman.likes} <img style={{cursor: 'pointer', padding: '5px'}} onClick={() => this.likeQuiz(hangman._id)} src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-512.png" /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}