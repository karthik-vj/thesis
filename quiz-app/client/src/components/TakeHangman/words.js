import React from 'react'
import axios from 'axios'
 

class words extends React.Component{

constructor(props) {
  super(props);
  this.state = {
      words: []
  }
}
componentDidMount(){
  axios.get('/api/hangmans/my-hangman/' + localStorage.getItem('_ID')).then(res => {
    this.setState({words: res.data})
  })
}
randomWord() {
  return words[
    Math.floor(Math.random() * this.state.words.length)
  ];
}

return(){

     randomWord =() =>{
        console.log(res.data[0].questions[0].answers[0].name)
          
        return words[Math.floor(Math.random()*words.length)]
      }
      
      }
}
export {randomWord}