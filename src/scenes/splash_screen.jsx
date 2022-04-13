import React from 'react';

import '../css/splash_screen.css';
import SplashUploadButton from '../components/splash_upload_button';

//NOTE::Element id/class naming conventions to make our lives easier when writing css.
//Use all lower case and seperate words with a dash. Example: id="upload-button"

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleSceneChange = this.handleSceneChange.bind(this);
  }

  handleSceneChange(e) {
    this.props.onSceneChange(e.target.value);
  }

  get show() {
    return this.props.activeScene === "SplashScreen";
  }

  render() {
    if (this.show) {
        return (
            <div className="App">
            <header className="App-header">
                <div id="splash-title">Normal Map Generator</div>
                <div id="splash-text">To begin, upload an image:</div>
                <div>
                    <SplashUploadButton onClick={this.handleSceneChange} />
                </div>
            </header>
            </div>
        );
        } else {
            return null;
        }
  }
}

export default SplashScreen;