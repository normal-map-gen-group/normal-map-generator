import { render } from "@testing-library/react";
import React from "react";
import styled from 'styled-components';

const sliderThumbStyles = (props) => (`
    width: 25px;
    height: 25px;
    background: ${props.color};
    cursor: pointer;
    outline: 5px solid #333;
    opacity: ${props.opacity};
    -webkit-transition: .2s;
    transition: opacity .2s;

`)
const Styles = styled.div`
    display: flex;
    align-items: center;
    color: #888;
    margin-top: 2rem;
    margin-button: 2rem;

    .value{
        flex: 1;
        font-size: 2rem;
    }

    .slider{
        flex: 6;
        -webkit-appearance: none;
        width: 100%;
        height: 15px;
        border-radius: 5px;
        background: #efefef;
        outline: none;

        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            ${props => sliderThumbStyles(props)}
        }

        .slider::-moz-range-thumb {
            ${props => sliderThumbStyles(props)}
        }
    }
`;

export default class Slider extends React.Component {
    state = {
        value: 50
    }

    handleOnChange = (e) => {
        this.setState({value:e.target.value})
    }

    render(){
        return (
            <Styles opacity={this.state.value > 10 ? (this.state.value/255):.1} color ={this.props.color}>
                <input type="range" min={0} max ={255} value={this.state.value} className="slider" onChange={this.handleOnChange}/>
                <div className="value"> {this.state.value}</div>
            </Styles>
        )
    }
}
