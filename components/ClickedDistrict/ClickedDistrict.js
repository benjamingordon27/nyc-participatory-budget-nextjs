import React from 'react';

const clickedDistrict = (props) => {
    var councilMemberImgUrl = 'https://raw.githubusercontent.com/NewYorkCityCouncil/districts/master/thumbnails/district-';

    return(
        <div>            
            <h3 style={{textAlign: 'center'}}>District {props.district}</h3>
            <div style={{position: 'relative',display: 'flex', alignContent: 'center'}}>
                <div style = {{float: 'left'}}>
                    <a href = {props.url}>
                        <div>
                            <img width='98' height='134' src={councilMemberImgUrl+props.district+'.jpg'} alt={props.district}/>
                        </div>
                    </a>                                
                </div>
                <div style = {{paddingLeft: '14px'}}>
                    <p style={{overflowWrap: 'break-word'}}>{props.name}<br/>
                    Email: <a href={`mailto:${props.email}`}>{props.email}</a><br/>
                    Website: <a href={props.url}>{props.url}</a><br/>
                    Phone number: <a href={`tel:${props.phone}`}>{props.phone}</a><br/>
                    Party: {props.party}</p>
                </div>
            </div>
        </div>
    );
}

export default clickedDistrict;