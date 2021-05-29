export const translateCategory = (item) => {

    let category = item.category;

    if( category.includes('Health and Environment')) return {...item, pinCategory: 'Public Health'}
    if( category === 'Public Safety & Public Health') return {...item, pinCategory: 'Public Safety'}

    if( category.includes('Safety')) return {...item, pinCategory: 'Public Safety'};
    if( category.includes('Communit') || category.includes('Cultur') || category.includes('District-Wide Priorities')) return {...item, pinCategory: 'Culture and Community Facilities'};
    if( category.includes('School') || category.includes('Education') || category.includes('Librar')) return {...item, pinCategory: 'Schools and Education'};
    if( category.includes('Environment')) return {...item, pinCategory: 'Environment'};
    
    if( category.includes('Recreation') || category.includes('Parks')) return {...item, pinCategory: 'Parks and Recreation'};
    if( category.includes('Health')) return {...item, pinCategory: 'Public Health'};
    
    // if( category.includes('')) return {...item, pinCategory: 'Previously funded'};
    
    if( category.includes('Housing')) return {...item, pinCategory: 'Housing'};
    if( category.includes('Sanitation')) return {...item, pinCategory: 'Sanitation'};
    if( category.includes('Senior')) return {...item, pinCategory: 'Seniors'};
    if( category.includes('Streets')) return {...item, pinCategory: 'Streets and Sidewalks'};
    if( category.includes('Transit') || category.includes('Transportation')) return {...item, pinCategory: 'Transit and Transportation'};
    if( category.includes('Youth')) return {...item, pinCategory: 'Youth'};
}

export const translateCategoryText = (category) => {

    if( category.includes('Health and Environment')) return ('Public Health');
    if( category === 'Public Safety & Public Health') return ('Public Safety');

    if( category.includes('Safety')) return ('Public Safety');
    if( category.includes('Communit') || category.includes('Cultur') || category.includes('District-Wide Priorities')) return ('Culture and Community Facilities');
    if( category.includes('School') || category.includes('Education') || category.includes('Librar')) return ('Schools and Education');
    if( category.includes('Environment')) return ('Environment');
    
    if( category.includes('Recreation') || category.includes('Parks')) return ('Parks and Recreation');
    if( category.includes('Health')) return ('Public Health');
    
    // if( category.includes('')) return {...item, pinCategory: 'Previously funded'};
    
    if( category.includes('Housing')) return ('Housing');
    if( category.includes('Sanitation')) return ('Sanitation');
    if( category.includes('Senior')) return ('Seniors');
    if( category.includes('Streets')) return ('Streets and Sidewalks');
    if( category.includes('Transit') || category.includes('Transportation')) return ('Transit and Transportation');
    if( category.includes('Youth')) return ('Youth');

    else
        return category;
}

export const translateAgencyToCategoryText = (item) => {    
    // 0: "BPL" library
    // 1: "DCA" department of consumer affairs
    // 2: "DCAS" department of citywide administrative services
    // 3: "DCLA" department of cultural affairs
    // 4: "DDC" department of design and construction
    // 5: "DFTA" department for the aging
    // 6: "DOT" department of transportation
    // 7: "DPR" parks and recreation
    // 8: "DSNY" sanitation
    // 9: "EDC" economic development corporation
    // 10: "H+H" health and hospitals
    // 11: "HPD" housing preservation and development
    // 12: "Non-City"
    // 13: "NON-CITY"
    // 14: "NYCHA"
    // 15: "NYPD"
    // 16: "NYPL" library
    // 17: "OEM" emergency management
    // 18: "QPL" queens public library
    // 19: "SCA" school construction authority

    if(item.description){
        // console.log(item.description);
        if(item.description.match(/( trees?)/gi)) return ('Environment');
        if(item.description.match(/( streets?)/gi)) return ('Streets and Sidewalks');
        if(item.description.match(/( arts?| artists?)/gi)) return ('Culture and Community Facilities');
        if(item.description.match(/( seniors?)/gi)) return ('Seniors');
        if(item.description.match(/(schools?|P\.?S\.?|campus|education)/gi)) return ('Schools and Education');
        if(item.description.match(/(violence)/gi)) return ('Public Safety');
        if(item.description.match(/(Anti\-Violence)/gi)) return ('Public Safety');
        if(item.description.match(/(food pantry)/gi)) return ('Public Health');
    }

    if(item.agency){
        // console.log(item.agency)
        if(item.agency.match(/(BPL|NYPL|QPL)/gi)) return ('Culture and Community Facilities');
        if(item.agency.match(/(SCA)/gi)) return ('Schools and Education');
        if(item.agency.match(/(NYPD)/gi)) return ('Public Safety');
        if(item.agency.match(/(H\+H)/gi)) return ('Public Health');
        if(item.agency.match(/(DOT)/gi)) return ('Transit and Transportation');
        if(item.agency.match(/(DFTA)/gi)) return ('Seniors');
        if(item.agency.match(/(DPR)/gi)) return ('Parks and Recreation');
        if(item.agency.match(/(DSNY)/gi)) return ('Sanitation');
        if(item.agency.match(/(HPD|NYCHA)/gi)) return ('Housing');
    }

    if(item.project){
        if(item.project === 'Mobile Food Pantry for West Side Campaign against Hunger') return ('Public Health');
        if(item.project.includes('Roof Repair') || 
            item.project === 'Structural Restoration of Poppenhusen Institute' ||
            item.project === 'Empower Immigrant Works by Supporting Local Cooperative' ||
            item.project.includes('Handicapped Bathroom Upgrade')) 
                return ('Culture and Community Facilities');
        
        if(item.project === 'Water Pump for Volunteer Fire Departments to Alleviate Flooding' ||
            item.project === 'Pagers for Volunteer Fire Departments' ||
            item.project.includes('System for Volunteer Fire Departments')) 
                return ('Public Safety');
        
        // console.log(item.project);
        // var matchItem = item.project.match(/( youth|harlem RBI)/gi);        
        if(item.project.match(/(violence)/gi)) return ('Public Safety');
        if(item.project.match(/( arts?| artists?)/gi)) return ('Culture and Community Facilities');
        if(item.project.match(/( youth|harlem RBI)/gi)) return ('Youth');
        if(item.project.match(/(schools?|P\.?S\.?|campus|education)/gi)) return ('Schools and Education');
    }
    return 'NA';
}


