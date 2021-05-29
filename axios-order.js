import axios from 'axios';

export const nyOpenDataAxios = axios.create({
    baseURL: 'https://data.cityofnewyork.us',
    headers: {
         'Content-Type': 'application/x-www-form-urlencoded' ,
        // "Access-Control-Allow-Origin": "*", 
        // "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    },    
});

export const googleCivicAxios = axios.create({
    baseURL: 'https://civicinfo.googleapis.com/civicinfo/v2/',
    headers: {
         'Content-Type': 'application/x-www-form-urlencoded' ,
        // "Access-Control-Allow-Origin": "*", 
        // "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    },    
});