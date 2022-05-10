import { React, useContext, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import appTheme from '../../theme/appTheme.json';
import Button from '@mui/material/Button';
import Tag from '../SelectableTags/Tag'
import Box from '@mui/material/Box';
import { TAG_CATEGORY_PLACE_HOLDER, TAGS_FOR_SPECIFIC_CATEGORY } from '../../utils/utilityFunctions';
import AmenityFilterTab from '../AmenityFilterTab';

const TagSelectionTab = ({ selectedTags, setSelectedTags, handleFilter }) => {
    const [selectedTab, setSelectedTab] = useState(TAG_CATEGORY_PLACE_HOLDER[0]);
    console.log("selectedTab1", selectedTab)
    const shelterUtilityTab = "ShelterUtilities";
    const categoryTabs = <>
        {TAG_CATEGORY_PLACE_HOLDER.map((name) => {
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
        })}
        <Grid key={shelterUtilityTab}>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    style={{
                        height: "30px",
                        backgroundColor: selectedTab === shelterUtilityTab ? appTheme.palette.primaryLight.light : appTheme.palette.primaryLight.main
                    }}
                >
                    <Button
                        
                        disableRipple={true}
                        onClick={() => {
                            setSelectedTab(shelterUtilityTab)
                        }}
                        style={{color: "black", textTransform: "none"}}
                        >
                        <Typography 
                            style={{fontSize: "1em"}}>{shelterUtilityTab}
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
    </>

    const tagsFilteredByCategory = () => {
        console.log("selectedTab", selectedTab)
        if (selectedTab == shelterUtilityTab) {
            console.log("amenity filter tab")
            return <AmenityFilterTab 
            selectedAmenityTags={selectedTags}
            setSelectedAmenityTags={setSelectedTags}
            displayShowResultButton={false}
            handleFilter={() => {}}
            displayClearAllButton={false}
            />
        } else {
        
            console.log("not amenity filter tab")
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
    }

    return (
          <Grid
            item
            container
            direction="column"
            alignItems='center'
            style={{width: "99%"}}>
                <Box sx={{width: "100%", height: "100%", overflow: "scroll", borderRadius: "10px", border: "1px solid rgba(228, 228, 228, 0.6)"}}>

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


                <Grid
                    item
                    style={{marginLeft: "20px", width: "100%", height:"100%"}}>
                    {tagsFilteredByCategory()}
                </Grid>
            
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    style={{padding: "20px"}}>
                    <Typography> </Typography>
                </Grid>
            </Box>
        </Grid>
    );
};

export default TagSelectionTab;
