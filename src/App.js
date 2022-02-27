import React from 'react';
import './App.css';
import UploadImages from './UploadImages';
import { Button, Card, Row, Col } from 'react-materialize';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Row>
          <Col s={2}><Button node="upload" waves="light">UPLOAD</Button></Col>
          <Col s={2}>&nbsp;</Col>
          <Col s={2}><Button node="download" waves="light">DOWNLOAD</Button></Col>
        </Row>
      </header>
    </div>
  );
}

export default App;
