import React from 'react';
import PropTypes from 'prop-types'

class App extends React.Component{
// class component render method를 자동적으로 실행한다.
  state = {
    count: 0
  };
  add = () => {
    this.setState(current => ({ count: current.count + 1 }))
  };
  minus = () => {
    this.setState(current => ({ count: current.count - 1 }))
  };
  componentDidMount(){
    console.log("conponent rendered");
  }
  //render가 실행됐을때
  componentDidUpdate(){
    console.log("컴포넌트가 업데이트 될때");
  } 
  //업데이트이후
  componentWillUnmount(){
    console.log("컴포넌트를 떠날때")
  }
  render() {
    console.log("iamrendering");
    return (
        <div>
          <h1>the number is {this.state.count}</h1>
          <button onClick={this.add}>Add</button>
          <button onClick={this.minus}>minus</button>
        </div>
      );
  }
}
export default App;
