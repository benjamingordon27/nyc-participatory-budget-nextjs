import React from 'react';
import classes from './HoverDropdown.module.css';

function HoverDropdown(props) {
    let options = '';
    if(props.list)
        options = props.list.map(item => <div onClick={props.clicked} key={item} value={item}>{item}</div>);

    return (
        <div className={classes.dropdown}>
            <span>{props.title}</span>            
            <div className={classes.dropdownContent}>                
                {options}
            </div>
        </div>
    );
}

export default HoverDropdown;