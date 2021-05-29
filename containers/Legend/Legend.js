import React from 'react';
import classes from './Legend.module.css';

const legend = (props) => {
    return (
        <div className = {classes.Legend}>
            {Object.keys(props.legendMarkers).map(key => (                
                <div key={key} onClick={() => props.filter(key)}>
                    {props.zoom <=12 ?
                        <img width={11} height={11} src={props.legendMarkers[key].dot} alt={key} />:
                        <img width={25.6} height={30} src={props.legendMarkers[key].img} alt={key} />
                    }                        
                    {' '}{key}
                </div>                
            ))}

        </div>
    );
}

export default legend;