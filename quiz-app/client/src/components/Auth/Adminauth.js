import React from 'react'
import axios from 'axios'
import Sidebar from '../Sidebar/Sidebar';
import Dialog from '../Dialog/dialog';

export default class Adminauth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      usersData: [],
      updatedData: [],
      inputVal: '',
      id: ''
    }
  }


  componentDidMount() {
    axios.get('api/users/all-users',).then(res => {
      console.log(res.data)
      this.setState({
        usersData: res.data
      })
    });
  }
  
  updateaccount = (userId) => {

    console.log()
    axios.post('api/users/update-user/'+userId, { userId, accountType: this.state.inputVal }).then(res => {
      console.log(res.data)
      if (res.data) {
        console.log(res)
      }
    
    }).catch((err) => { console.log(err.response.data) })
  }

  update = (userId) => {
   
    axios.put('api/users/update/'+userId, { userId: this.state.usersData._id, accountType: this.state.inputVal }).then(res => {
      if (res.data) {
        console.log(res.data)
      }
    }).catch((err) => { console.log(err.response.data) })
  }


  render() {
    return (
      <div className="community-quizzes-wrapper">
        <div>
          <Sidebar />
        </div>
        <div className="body">
          <div className="header-top">Users</div>
          <div className="quizzes-wrapper">
            {this.state.usersData.map((user, idx) => (
              <div key={idx} className="quiz-card card">
                <img src={'https://images.unsplash.com/photo-1518770660439-4636190af475?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'} alt=''  />
                <div className="quiz-name">{user.firstName}</div>
                <div className="category">{user.email}</div>
                <div className="category">{user.accountType}</div>
                <div className="take-quiz btn" onClick={() => this.setState({ addQuestion: true, id: user._id })}>Update</div>
              </div>
            ))}
          </div>
        </div>
        <Dialog model={this.state.addQuestion}>
          <div className="new-question-form">
            <div className="input-field">
              <div style={{ display: "flex", flexDirection: "column" }}><h2 style={{ padding: "10px 20px", textAlign: "center", color: "Black" }}>
                Account Update
              </h2></div>
              <input value={this.state.inputVal} onChange={e => this.setState({ inputVal: e.target.value })} type="text" placeholder="Add Account Type" /><br></br>
              <br></br><div className="btn" onClick={() => this.setState({ addQuestion: false })}>Close</div><br></br>
              <button className="btn" onClick={this.update}>Send</button>
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}
