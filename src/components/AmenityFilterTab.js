import { React, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import appTheme from '../theme/appTheme.json';
import Button from '@mui/material/Button';
import Tag from './SelectableTags/Tag';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AppStore from '../pages/AppStore';
import { useStore } from '../pages/Hook';
import { observer } from 'mobx-react';


const CATEGORY_PLACE_HOLDER = ["Amenties", "Disability Amenities", "Maintained", "Shelter Type", "Others"]
const TAGS_FOR_SPECIFIC_AMENITY = new Map([
    ["Amenties", ["Bathroom", "Shower", "Hot water", "Heating System"]],
    ["Disability Amenities", ["Wheelchair Ramp", "Elevator"]],
    ["Maintained", ["Well-Maintained Amenities"]],
    ["Shelter Type", ["Female Only", "Male Only", "Youth Only", "Pet Friendly", "Kid Friendly", "LGBTQ Friendly", "Ex-Convict Friendly"]],
    ["Others", ["Free Clothes", "Free Hygiene kits", "Employment Help Center"]]
])

//TODO: AMANDA update the deault isDashboard to false
const AmenityFilterTab = observer(({ selectedAmenityTags, setSelectedAmenityTags, displayShowResultButton, handleFilter, displayClearAllButton = true, maxHeight = "100%", isDashboard = false }) => {
    const [selectedTab, setSelectedTab] = useState(CATEGORY_PLACE_HOLDER[0]);
    const [selectedInfoRange, setSelectedInfoRange] = useState("verfiedInfo")
    const { appStore } = useStore();


    //console.log("displayClearAllButton", displayClearAllButton)
    //console.log("selectedInfoRange", selectedInfoRange)
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
                        style={{ color: "black", textTransform: "none" }}
                    >
                        <Typography
                            style={{ fontSize: "1em" }}>{name}
                        </Typography>
                    </Button>
                </Grid>

            </Grid>
        )
    })

    const tagsFilteredByCategory = () => {

        //console.log("selectedTags in tab component: " + selectedAmenityTags)
        return TAGS_FOR_SPECIFIC_AMENITY.get(selectedTab).map((text) => {
            return <Tag key={text} isSelectable={true} text={text} selectedTags={selectedAmenityTags} setSelectedTags={setSelectedAmenityTags} />
        })
    }

    return (
        <Grid
            container
            direction="column"
            style={{ minWidth: "400px", maxHeight: maxHeight }}>
            {isDashboard &&
                <>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={appStore.searchRange != "" ? appStore.searchRange : "verfiedInfo"}
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="verfiedInfo" onClick={() => {
                            setSelectedInfoRange("verfiedInfo")
                            appStore.setSearchRange("verfiedInfo")
                        }} control={<Radio />} label="Search by verified data by shelter owners" />
                        <FormControlLabel value="allInfo" onClick={() => {
                            setSelectedInfoRange("allInfo")
                            appStore.setSearchRange("allInfo")
                        }} control={<Radio />} label="Search by all data inclduing comments" />
                    </RadioGroup>
                </>}
            <Typography style={{ fontWeight: "bold", marginTop : "10px"}}>Filter by amenities:</Typography>

            <Grid
                container
                direction="row"
                wrap='nowrap'>
                <Grid
                    item
                    container
                    direction="column"
                    style={{ width: "100px" }}
                >
                    {tabs}
                </Grid>

                <Grid
                    item
                    style={{ marginLeft: "10px" }}
                    sx={{ width: { xs: "150px", sm: "300px" } }}>
                    {tagsFilteredByCategory()}
                </Grid>
            </Grid>

            {(displayClearAllButton || displayShowResultButton) &&
                <>
                    <Divider style={{ width: "100%", marginTop: "0px", marginBottom: "20px" }} />
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ padding: "0px 20px" }}>
                        {displayClearAllButton &&
                            <Button
                                style={{ backgroundColor: "#c4c4c4", fontFamily: "Roboto" }}
                                variant='contained'
                                onClick={() => {
                                    setSelectedAmenityTags([])
                                }}>
                                Clear All
                            </Button>}

                        {displayShowResultButton &&
                            <Button variant='contained'
                                style={{ marginRight: "57px" }}
                                onClick={() => {
                                    handleFilter()
                                }}>
                                Show Result
                            </Button>}
                    </Grid>
                </>
            }
        </Grid>
    );
});

export default AmenityFilterTab;
