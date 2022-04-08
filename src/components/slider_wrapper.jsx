import React from 'react';
import PropTypes from 'prop-types';

const SliderWrapper = props => {
    console.log({...props})
    return (
    <input 
        type="range"
        {...props}
        min={props.min_value}
        max={props.max_value}
        step={props.step_value}
        defaultValue={props.default_value}
        onChange={props.funcForThis}
    />
    );
};

SliderWrapper.propTypes = {
    children: PropTypes.node,
    min_value: PropTypes.number,
    max_value: PropTypes.number,
    step_value: PropTypes.number,
    default_value: PropTypes.number,
    funcForThis: PropTypes.func,
};

export default SliderWrapper