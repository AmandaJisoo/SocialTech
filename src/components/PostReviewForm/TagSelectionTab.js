import { React, useContext, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import appTheme from '../../theme/appTheme.json';
import Button from '@mui/material/Button';
import Tag from '../SelectableTags/Tag'
import Box from '@mui/material/Box';
import { TAG_CATEGORY_PLACE_HOLDER, TAGS_FOR_SPECIFIC_CATEGORY } from '../../utils/utilityFunctions';

const TagSelectionTab = ({ selectedTags, setSelectedTags, handleFilter }) => {
    const [selectedTab, setSelectedTab] = useState(TAG_CATEGORY_PLACE_HOLDER[0]);

    const categoryTabs = TAG_CATEGORY_PLACE_HOLDER.map((name) => {
        return (
        <Grid key={name}>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{
                    height: "30px",
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
        return TAGS_FOR_SPECIFIC_CATEGORY.get(selectedTab).map((text, index) => {
            return <Tag 
                    key={text + index} 
                    isSelectable={true} 
                    text={text} 
                    selectedTags={selectedTags} 
                    setSelectedTags={setSelectedTags} 
                    selectedCategory={selectedTab}
                    isTagSelectionMutualExclusiveWithinCategory={selectedTab != "Others"}/>
        })
    }


    useEffect(() => {

    }, [selectedTags])

    return (
          <Grid
            item
            container
            direction="column"
            alignItems='center'
            style={{width: "90%"}}>

            <Box sx={{width: "100%", borderRadius: "10px", border: "1px solid rgba(228, 228, 228, 0.6)"}}>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent='center'
                    style={{width: "100%"}}>
                    <Typography>More Tags</Typography>
                </Grid>

                <Grid
                    item
                    container
                    direction="row"
                    alignItems='center'
                    justifyContent='center'
                    style={{width: "100%"}}
                >
                    {categoryTabs}
                </Grid>

                <Divider style={{width: "100%", marginTop: "10px", marginBottom: "10px"}}/>

                <Grid
                    item
                    style={{marginLeft: "20px", width: "100%"}}>
                    {tagsFilteredByCategory()}
                </Grid>
            
                <Divider style={{width: "100%", marginTop: "10px", marginBottom: "0px"}}/>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    style={{padding: "20px"}}>
                    <Typography>Choose only one tag in each category</Typography>
                </Grid>
            </Box>
        </Grid>
    );
};

export default TagSelectionTab;
