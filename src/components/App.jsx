import React, {useState} from 'react';

import '../css/App.css';

import SplashScreen from '../scenes/splash_screen';
import PerspectiveFixer from '../scenes/perspective_fixer';
import MainScreen from '../scenes/main_screen';


const Main = ({ activeScene, handleSceneChange, baseImage }) => (
  <React.Fragment>
    <SplashScreen activeScene={activeScene}  onSceneChange={handleSceneChange} baseImage={baseImage} />
    <PerspectiveFixer activeScene={activeScene}  onSceneChange={handleSceneChange} baseImage={baseImage} />
    <MainScreen activeScene={activeScene}  onSceneChange={handleSceneChange} baseImage={baseImage}/>
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


  return (
    <div className="App">
      <Main activeScene={activeScene} handleSceneChange={handleSceneChange} baseImage={image} />
    </div>
  );
}


export default App;
