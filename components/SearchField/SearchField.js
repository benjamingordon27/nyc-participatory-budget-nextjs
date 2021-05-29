import React from 'react';

const SearchField = (props) => {
    return(
        <div style={{padding: '12px'}}>
            <input type='text' placeholder = {props.placeholder} onChange = {props.onChange}></input>
        </div>
    );
}

export default SearchField;