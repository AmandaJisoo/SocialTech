import { React, useContext, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import appTheme from '../../theme/appTheme.json';
import Button from '@mui/material/Button';
import Tag from '../SelectableTags/Tag'

const CATEGORY_PLACE_HOLDER = ["Cleaness", "Safety", "Warmth", "Utilities", "Others"]
const TAGS_FOR_SPECIFIC_AMENITY = new Map([
    ["Cleaness", ["Very clean", "Clean", "So-so", "Not clean", "Messy", "Dirty"]],
    ["Safety", ["Very safe", "safe", "unsafe", "Dangerous"]],
    ["Warmth", ["Warm", "Not worm"]],
    ["Utilities", ["Fully-equipipped", "Just okay", "Lack utilities "]],
    ["Others", ["free clothes", "free hygiene kits", "employment help center"]]
])

const TagSelectionTab = ({ selectedTags, setSelectedTags, handleFilter }) => {
    const [selectedTab, setSelectedTab] = useState(CATEGORY_PLACE_HOLDER[0]);

    const tabs = CATEGORY_PLACE_HOLDER.map((name) => {
        return (
        <Grid key={name}>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{
                    width: "100px",
                    height: "50px",
                    backgroundColor: selectedTab === name ? appTheme.palette.primaryLight.light : appTheme.palette.primaryLight.main
                }}
            >
                <Button
                    
                    disableRipple={true}
                    onClick={() => {
                        setSelectedTab(name)
                    }}
                    style={{color: "black", textTransform: "none"}}
                    >
                    <Typography 
                        style={{fontSize: "1em"}}>{name}
                    </Typography>
                </Button>
            </Grid>
            
        </Grid>
        )
    })

    const tagsFilteredByCategory = () => {
        
        //console.log("selectedTags in tab component: " + selectedAmenityTags)
        return TAGS_FOR_SPECIFIC_AMENITY.get(selectedTab).map((text) => {
            return <Tag key={text} isSelectable={true} text={text} selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
        })
    }


    useEffect(() => {

    }, [selectedTags])

    return (
      <Grid
        container
        direction="column"
        style={{minWidth: "400px"}}>

        <Grid
            item
            container
            direction="row"
            style={{width: "100px"}}>
            <Typography>More Tags</Typography>
        </Grid> 

        <Grid
        item
        container
        direction="row"
        style={{width: "100px"}}
        >
            {tabs}
        </Grid>


        <Divider style={{width: "100%", marginTop: "0px", marginBottom: "20px"}}/>

        <Grid 
        item
        style={{marginLeft: "20px", width: "300px"}}>
            {tagsFilteredByCategory()}
        </Grid>
        
        <Divider style={{width: "100%", marginTop: "0px", marginBottom: "20px"}}/>

        <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{padding: "0px 20px"}}>
            <Typography>Choose only one tag in each category</Typography>    
        </Grid>
      </Grid>
    );
};

export default TagSelectionTab;
