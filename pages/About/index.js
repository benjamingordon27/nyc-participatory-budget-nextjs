import React from 'react';

const About = () => {
    return (
        <div className='sidebar'>
            <h2 style={{textAlign: 'center'}}>Tracking Participatory Budget Items from 2012-2017</h2>
            <p>This site maps all participatory budgeting 
                projects approved from 2012-2017, showing where the projects are geographically, and
                 which city council district they are in. 
                 Each individual project is represented by a marker to indicate the kind of proposal. <br/>                
            </p>
            <ul>
                <li>Click on the marker to see what budget was allocated at that location and for what purpose. </li>
                <li>Contact information for the city council member representing the district is provided for further inquiries.</li>
            </ul>
                

            <p>Work in progress. Created in React JS using Mapbox</p>
            <p>Created by Benjamin Gordon and Cullen Riley-Duffy</p>
        </div>
    );
};

export default About;