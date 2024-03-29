import React from "react";
import axios from 'axios';
import { BrowserRouter as Router ,Route, Switch, Redirect } from "react-router-dom";
import Auth from './components/Auth/Auth'
import Dashboard from "./components/Dashboard/Dashboard";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz"
import CommunityQuizzes from "./components/CommunityQuizzes/CommunityQuizzes";
import MyQuizzes from "./components/MyQuizzes/MyQuizzes";
import ViewQuiz from "./components/ViewQuiz/ViewQuiz";
import TakeQuiz from "./components/TakeQuiz/TakeQuiz";
import Profile from "./components/Profile/Profile";
import ViewResults from "./components/ViewResults/ViewResults";
import CreateHangman from "./components/CreateHangman/CreateHangman";
import ViewHangman from "./components/ViewHangman/ViewHangman";
import TakeHangman from "./components/TakeHangman/TakeHangman";
import CommunityHangman from "./components/CommunityQuizzes/CommunityHangman"
import Adminauth from "./components/Auth/Adminauth";
import ViewHangmanResults from "./components/ViewResults/ViewHangmanResults"
import store from './store';


class App extends React.Component{

  componentDidMount() {
    if (localStorage.getItem('_ID')) {
      axios.get(`/api/users/${localStorage.getItem('_ID')}`).then(res => {
        store.dispatch({
          user: res.data.user,
          type: 'set_user'
        })
      }).catch(er => {
        console.log(er);
      })
    }
  }

  render()
  {
    return (
      <div className="App">
       <Router forceRefresh = {true}>
        <Switch>
          <Route exact path="/" component ={Auth}/>
          <Route path="/dashboard" component={Dashboard}/>
          <Route path="/create-quiz" component={CreateQuiz}/>
          <Route path="/my-quizzes" component={MyQuizzes}/>
          <Route path="/community-quizzes" component={CommunityQuizzes}/>
          <Route path= "/community-hangman" component={CommunityHangman}/>
          <Route path="/view-quiz" component={ViewQuiz}/>
          <Route path="/take-quiz" component={TakeQuiz}/>
          <Route path="/view-results" component={ViewResults}/>
          <Route path="/view-hangmanresults" component={ViewHangmanResults}/>
          <Route path="/account" component={Profile}/>
          <Route path="/create-hangman" component={CreateHangman}/>
          <Route path="/view-hangman" component={ViewHangman}/>
          <Route path="/take-hangman" component={TakeHangman}/>
          <Route path="/admin" component={Adminauth}/>
          <Route path="*">
            <Redirect to  = "/" />
          </Route>

        </Switch>
      </Router>
    </div>
    )
  }
}

export default App;

  