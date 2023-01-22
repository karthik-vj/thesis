import React from "react";
import './Dashboard.css';
import Sidebar from '../Sidebar/Sidebar2';
import qs from 'qs';
import axios from "axios";
import Dialog from "../Dialog/dialog";

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            result: null,
            quiz: null,
            quizzes: [],
            hangman: [],
            tempResult: [],
            quizId: '',
            result: [],
            addQuestion: false,
            allStudent:[],
            test: [],
            name:'',
            competency: ''
        }
    }
    componentDidMount() {
        if (!localStorage.getItem('JWT_PAYLOAD')) {
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
        axios.get('/api/results/student/' + localStorage.getItem('_ID')).then(res => {
            console.log(res.data)
            this.setState({allStudent: res.data})
        }).catch(er => { console.log(er.response.data) })
    }

   quiz = (quizId,name) =>{
        axios.get('api/results/allresult/'+ localStorage.getItem('_ID') + '/' + quizId).then(res => {
            console.log(res.data)
            this.setState({ test: res.data,name:name })

        }).catch(er => { console.log(er.response.data) })

        this.clac()

        axios.get('/api/results/all-result/' + localStorage.getItem('_ID') + '/' + quizId).then(res => {
            console.log(res.data)
            this.setState({ tempResult: res.data })
        }).catch(er => { console.log(er.response.data) })


        axios.get('/api/results/all-students/' + localStorage.getItem('_ID') + '/' + quizId).then(res => {
            console.log(res.data)
            this.setState({ result: res.data })
        }).catch(er => { console.log(er.response.data) })
        
    }
    compe = ()=>{
        
        let eScore = this.state.result.map((acc)=>(acc.Result)).toString()
        console.log("eScore",eScore.toString())
        let presentScore = this.state.tempResult.map((acc)=>(acc.accountResult)).toString()
        console.log("presentScore",presentScore.toString())
        let newScore = eScore + (1- eScore) * presentScore
        console.log(newScore)
        return newScore

    }

    clac(){
       this.setState({ addQuestion: true })
    }
    avg(){
        this.state.test.map((acc)=>(acc.accountResult))
        let b = (this.state.test.map((acc)=>(acc.accountResult)))
        const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        const result = average( b )
        return result
    }


    render() {
        let result = this.state.tempResult
        return (
            <div className="dashboard-wrapper">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="main">
                    <div className="top">
                        
                        <div className="right">
                            <div className="header">My Dashboard</div><br></br>
                            <div className="quizzes-wrapper" >
                                {this.state.quizzes.map((quiz, idx) => (
                                    <div key={idx} className="quiz-card card">
                                        <div className="quiz-name">Name:    {quiz.name}</div><br></br>
                                        <div className="take-quiz btn" onClick={() => this.quiz(quiz._id,quiz.name) }>View Quiz Results</div>
                                        <div className="top-section">
                                            <div className="likes"> <img style={{ cursor: 'pointer', padding: '15px' }} /></div>
                                        </div>
                                    </div>
                                ))}
                                 {this.state.hangman.map((hangman, idx) => (
                                    <div key={idx} className="quiz-card card">
                                        <div className="quiz-name">Name:   {hangman.name}</div><br></br>
                                        <div className="take-quiz btn" onClick={() => this.quiz(hangman._id) }>View Quiz Results</div>
                                        <div className="top-section">
                                            <div className="likes"> <img style={{ cursor: 'pointer', padding: '15px' }} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Dialog model={this.state.addQuestion}>
          <div className="new-question-form">
            <div className="input-field">
              <div style={{ display: "flex", flexDirection: "column" }}><h2 style={{ padding: "10px 20px", textAlign: "center", color: "Black" }}>
                Result for {this.state.name}
              </h2></div>
              <div>{this.state.test.map((result ,idx)=> (
                <><div className="quiz-name">Result: {result.accountResult}</div>
                <div></div>
                </>
              ))}</div><br></br><h2>Average: {this.avg()}</h2>
              <h2> 
                <div>Competency: {this.compe()}</div>
              </h2>
              <br></br><div className="btn" onClick={() => this.setState({ addQuestion: false })}>Close</div><br></br>
            </div>
          </div>
        </Dialog>

                    <div className="bottom">

                    </div>
                </div>
            </div>
        )
    }
}

/* <div className="left">
                            <div className="header">Statistics</div><br></br>
                            <div className="quizzes-wrapper" >
                            {this.state.allStudent.map((result, idx) => (
                                <div key={idx} className="quiz-card card">
                                    <div className="quiz-name">{result.Result}</div><br></br>
                                    <div className="top-section">
                                        <div className="likes"> <img style={{ cursor: 'pointer', padding: '15px' }} /></div>
                                    </div>
                                </div>
                            ))}</div>
                        </div> */

                         /*let acc = this.state.tempResult[0].accountResult
        let presentScore = this.state.result[0].Result/10
        let newScore = acc + ( 10 - acc)* presentScore
        //return (newScore)
        console.log("acc",acc)
        console.log("quiz",this.state.quizzes)
        console.log("result",this.state.result)
        console.log("new score", newScore)
        console.log("modal", this.state.modal)*/