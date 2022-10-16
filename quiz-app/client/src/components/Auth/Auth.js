import React from 'react';
import Signup from './Signup';
import Signin from './Signin';
import './Auth.css';
import axios from 'axios';
import store from '../../store/index';
import { withRouter } from 'react-router'



 class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'signin',
            showToast: false
        }
    }

    signIn = (email, password) => {
        axios.post('/api/users/login', {email, password}).then(res => {
            if (res.data.success) {
                store.dispatch({
                    type: 'login',
                    _id: res.data.user._id,
                    user: res.data.user,
                    token: res.data.token
                });
                this.props.history.push("/dashboard");
                document.location.reload()
            }
        }).catch(er =>{
            console.log(er)
        })
        
    }

    signUp = ({firstName, lastName, email, password}) => {
        axios.post('api/users/register',{firstName, lastName, email,password}).then(res =>{
            if(res.data.success){
                this.setState({tab:'signin'})
            }
        }).catch(er =>{
            console.log(er)
        })
    }
    changeTab = () =>{
        this.setState({
            tab: this.state.tab === 'signup' ? 'signin' : 'signup'
        })
    }

    render() {
        let page = this.state.tab === 'signin' ? <Signin signIn={this.signIn} /> : <Signup signUp={this.signUp} />
        return (
            <div className="auth-wrapper">
                
                <div className="left">
                    <img src="https://freesvg.org/img/chemist.png" alt=''/>
                </div>

                <div className="right">
                    <div className="header">Quiz itt</div>
                    <div className="sub-header">Welcome to Quiz itt</div>
                    {page}
                    <div className="new" onClick={this.changeTab}>{this.state.tab === 'signin' ? 'New to Quiz itt? Sign up here' : 'Already have an account with us? Sign in'}</div>
                </div>
            </div>
        )
    }


}
export default withRouter(Auth)