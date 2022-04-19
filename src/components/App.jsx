import React, {useState} from 'react';

import '../css/App.css';

import SplashScreen from '../scenes/splash_screen';
import PerspectiveFixer from '../scenes/perspective_fixer';
import MainScreen from '../scenes/main_screen';


const Main = ({ activeScene, goBack, handleSceneChange, baseImage }) => (
  <React.Fragment>
    <SplashScreen activeScene={activeScene} onGoBack={goBack} onSceneChange={handleSceneChange} baseImage={baseImage} />
    <PerspectiveFixer activeScene={activeScene}  onGoBack={goBack} onSceneChange={handleSceneChange} baseImage={baseImage} />
    <MainScreen activeScene={activeScene}  onGoBack={goBack} onSceneChange={handleSceneChange} baseImage={baseImage}/>
  </React.Fragment>
);

function App(props) {

  const [activeScene, setactiveScene] = useState("SplashScreen")
  const [image, setImage] = useState(new Image())


  function handleSceneChange() {
    let { name } = "";
    if (activeScene === "SplashScreen") {
      name = "PerspectiveFixer";
    } else {
      name = "MainScreen";
    }

    setactiveScene(name);
  }

  function goBack() {
    let { name } = "";
    if (activeScene === "MainScreen") {
      name = "PerspectiveFixer";
    } else {
      name = "SplashScreen";
    }

    setactiveScene(name);
  }

  return (
    <div className="App">
      <Main activeScene={activeScene} goBack={goBack} handleSceneChange={handleSceneChange} baseImage={image} />
    </div>
  );
}


export default App;
