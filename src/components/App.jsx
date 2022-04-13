import React from 'react';

import '../css/App.css';

import SplashScreen from '../scenes/splash_screen';
import PerspectiveFixer from '../scenes/perspective_fixer';
import MainScreen from '../scenes/main_screen';

//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"

const Main = ({ activeScene, handleSceneChange }) => (
  <React.Fragment>
    <SplashScreen activeScene={activeScene}  onSceneChange={handleSceneChange} />
    <PerspectiveFixer activeScene={activeScene}  onSceneChange={handleSceneChange} />
    <MainScreen activeScene={activeScene}  onSceneChange={handleSceneChange} />
  </React.Fragment>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeScene: "SplashScreen"
    };

    this.handleSceneChange = this.handleSceneChange.bind(this);
  }

  handleSceneChange(e) {
    let { name } = "";
    if (this.state.activeScene === "SplashScreen") {
      name = "PerspectiveFixer";
    } else {
      name = "MainScreen";
    }

    this.setState(() => ({
      activeScene: name
    }));
  }

  render() {
    return (
      <div className="App">
        <Main activeScene={this.state.activeScene} handleSceneChange={this.handleSceneChange} />
      </div>
    );
  }
}

export default App;
