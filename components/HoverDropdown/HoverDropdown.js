import React from 'react';
import classes from './HoverDropdown.module.css';

function HoverDropdown() {
    return (
        <div className={classes.dropdown}>
            <span>Mouse over me</span>
            <div className={classes.dropdownContent}>
                <p>Hello World!</p>
            </div>
        </div>
    );
}

export default HoverDropdown;