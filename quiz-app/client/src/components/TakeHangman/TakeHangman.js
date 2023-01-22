import React from 'react';
import './TakeHangman.css';
import $ from 'jquery';
import ProgressBar from '../ProgressBar/ProgressBar';
import axios from 'axios';

import step1 from "./Assets/1.png";
import step2 from "./Assets/2.png";
import step3 from "./Assets/3.png";
import step4 from "./Assets/4.png";
import step5 from "./Assets/5.png";
import step6 from "./Assets/6.png";
import step7 from "./Assets/7.png";

export default class TakeHangman extends React.Component {

  static defaultProps = {
    maxWrong: 6,
    images: [step1, step2, step3, step4, step5, step6, step7]
  }
  constructor(props) {
    super(props);
    this.state = {
      hangman: {},
      authorized: false,
      answers: [],
      activeQuestionIdx: 0,
      percentage: 0,
      score: 0,
      mistake: {},
      guessed: {}
    }
  }

  componentDidMount() {
    $('#modal-wrapper-hangman').hide();
    if (this.props.location.state !== undefined) {
      
      this.setState({ authorized: true });
      let hangman = this.props.location.state.hangman;
      hangman.questions.map((question) => {
        question.answers[0] = question.answers[0].toUpperCase();
        return question;
      })
      this.setState({
        hangman: hangman,
        answers: Array(hangman.questions.length).fill(0),
        mistake: Array(hangman.questions.length).fill(0),
        guessed: Array(hangman.questions.length).fill('')
      });

    }
  }

  prevQuestion = () => {
    let newIdx = this.state.activeQuestionIdx;
    newIdx--;
    if (newIdx < 0) return;
    this.setState({ activeQuestionIdx: newIdx });
    
  }

  nextQuestion = () => {
    let newIdx = this.state.activeQuestionIdx;
    newIdx++;
    if (newIdx === this.state.hangman.questions.length) return;
    this.setState({ activeQuestionIdx: newIdx });
    
    console.log("score", this.state.score)
    console.log(this.state.answers)
    this.Score()
  }

  getPercentage = (ans) => {
    let total = 0;
    ans.forEach(answer => {
      if (answer !== 0) {
        total += (1 / this.state.answers.length);
      }
    });
    this.setState({ percentage: total });
  }

  

  showModal = () => {
    $('#modal-wrapper-hangman').fadeIn(300);
  }

  hideModal = () => {
    $('#modal-wrapper-hangman').fadeOut(300);
  }

  finishHangman = () => {
    axios.post('/api/hangmans/save-results', {
      currentUser: localStorage.getItem('_ID'),
      answers: this.state.answers,
      hangmanId: this.state.hangman._id
    }).then(res => {
      if (res.data) {
        this.props.history.push('/view-hangmanresults?id=' + res.data.scoreId);
        console.log(res.data.scoreId)
        document.location.reload()
      }
    })
  }

  handleGuess = e => {
    let letter = e.target.value;
    let mistake = this.state.mistake;
    let guessed = this.state.guessed;
    mistake[this.state.activeQuestionIdx] += this.state.hangman.questions[this.state.activeQuestionIdx].answers[0].includes(letter) ? 0 : 1
    guessed[this.state.activeQuestionIdx] = guessed[this.state.activeQuestionIdx].concat(letter);
    console.log(guessed);
    this.setState({
      guessed: guessed,
      mistake: mistake
    })
    console.log("mistake",mistake)
    console.log("Guessed",guessed[this.state.activeQuestionIdx])
  }

  guessedWord() {
    const answer = this.state.hangman.questions[this.state.activeQuestionIdx].answers[0];
    let guessedWord = answer.split("").map(letter => (this.state.guessed[this.state.activeQuestionIdx].includes(letter) ? letter : " _ "));
    return guessedWord;
    
  }

  generateButtons() {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => (
      <button
        className='btn btn-lg btn-primary m-2'
        key={letter}
        value={letter}
        onClick={this.handleGuess}
        disabled={this.state.guessed[this.state.activeQuestionIdx].includes(letter)}
      >
        {letter}
      </button>
    ));
  }
  Score = ()=>{
    
    if(this.state.hangman.questions[this.state.activeQuestionIdx].answers[0] === this.guessedWord().join("")){
      this.state.answers[this.state.activeQuestionIdx] = true;
    } else {
        this.state.answers[this.state.activeQuestionIdx] = false;
    }
    return;
  }
  

  render() {
    let { hangman, activeQuestionIdx, guessed } = this.state;
    return (
      <>
        <div id="modal-wrapper-hangman" className="modal-wrapper-hangman">
          <div className="content">
            <div className="header">Are you sure you wish to submit your answers</div>
            <div className="buttons-wrapper">
              <button onClick={this.hideModal}>Cancel</button>
              <button onClick={this.finishHangman}>Yes</button>
            </div>
          </div>
        </div>
        <div className="take-hangman-wrapper">
          {this.state.authorized ?

            <div className="content">
              <div className="header">
                <div className="left">
                  {this.state.hangman.name}
                </div>
                <ProgressBar
                  className="center"
                  progress={Number((this.state.percentage * 100).toFixed(0))}
                  size={160}
                  strokeWidth={15}
                  circleOneStroke='#dadfea'
                  circleTwoStroke={'#00aaf1'}
                />
              </div>

              <div className="body">
                <div className="left">
                  <div className="question-name">{hangman.questions[this.state.activeQuestionIdx].questionName}</div>

                  <div className="float-right">Wrong Guesses: {this.state.mistake[this.state.activeQuestionIdx]} of {this.props.maxWrong}</div>
                  <p>
                  </p><br></br><br></br>
                  {hangman.questions[this.state.activeQuestionIdx].answers[0] === this.guessedWord().join("")
                    ? <p>Next</p>:
                    (this.state.mistake[this.state.activeQuestionIdx] === this.props.maxWrong
                      ? <div><p>Max Try reached </p>
                        <p>Click nextQuestion</p></div> :
                      <div><p className='Hangman-word'>{this.guessedWord()}</p>
                        <p className='Hangman-btns'>{this.generateButtons()}</p></div>)}

                  <div className="question-bubble-wrapper">
                    {hangman.questions.map((ans, idx) => (
                      <span onClick={() => this.setState({ activeQuestionIdx: idx })} key={idx} className={this.state.activeQuestionIdx === idx ? 'question-bubble selected-bubble' : this.state.answers[idx] === 0 ? "question-bubble" : 'question-bubble bubble-correct'}>
                        {idx + 1}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="right">
                  <div className="answers-wrapper">
                    <div >
                      <img src={this.props.images[this.state.mistake[this.state.activeQuestionIdx]]} alt="" />
                    </div>

                  </div>
                </div>
              </div>
              <div className="footer">
                <div className="buttons-wrapper">
                  <button onClick={this.prevQuestion}>Previous</button>
                  {this.state.activeQuestionIdx + 1 < this.state.hangman.questions.length ? <button onClick={this.nextQuestion}>Next</button> : <button onClick={this.showModal}>Submit Hangman</button>}
                </div>
              </div>
            </div>

            : <div>Not authorized</div>}
        </div>
      </>
    )
  }
}