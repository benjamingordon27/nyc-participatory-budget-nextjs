import React from 'react';
import classes from './Dropdown.module.css';

const dropdown = (props) => {       
    let options = '';
    if(props.list)
        options = props.list.map(item => <option key={item} value={item}>{item}</option>);
    return(
        <div>
            {props.title}<br></br>
            <select id={props.id} onChange={props.handleChange}>
                {/* <option value={props.value}>{props.value}</option> */}
                <option value={''}>{''}</option>
                {options}
            </select>
            {/* <div className={classes.dropdown}>
            <button className={classes.dropbtn}>{props.title}</button>
                <div className={classes.dropdownContent}>
                    <a href="#">Link 1</a>
                    <a href="#">Link 2</a>
                    <a href="#">Link 3</a>
                </div>
            </div> */}
        </div>
    );
}

export default dropdown;