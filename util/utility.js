export const uniqueValueBudget = (data, variable, helperFunction = '') => {
    var output = new Set();    
    data.map(i => {                
        if(helperFunction === '')
            output.add(i.properties[variable]);
        else
            output.add(helperFunction(i.properties[variable]));
    })
    return [...output].sort();
}

export const sortAlphaNum = (a, b) => a.localeCompare(b, 'en', { numeric: true })

export const uniqueValueCouncilMember = (data) => {
    var output = new Set();    
    data.map(i => {                        
        output.add(i.district + ": " + i.name);
    })
    return [...output].sort(sortAlphaNum);
}

export const uniqueValueAgency = (data) => {
    var output = new Set();    
    data.map(i => {                        
        output.add(i.properties.agency);
    })
    
    return [...output].sort(sortAlphaNum);
}