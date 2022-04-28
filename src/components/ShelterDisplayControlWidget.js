import {React, useState} from 'react';
import { SORT_OPTIONS } from '../utils/utilityFunctions';
import { Grid, Button, Typography } from '@mui/material';
// import { useStore } from './Hook';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import AmenityFilterTab from './AmenityFilterTab';
import SortOption from './SortOption';
import { useStore } from '../pages/Hook';

const ShelterDisplayControlWidget = ({setShelterData, shelterData}) => {
    const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
    const [query, setQuery] = useState("");
    const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
    const [filterByAmenityDrawerOpen, setFilterByAmenityDrawerOpen] = useState(false);
    const [selectedAmenityTags, setSelectedAmenityTags] = useState([]);
    console.log('shelterData', shelterData)
    const sortMenuItems = SORT_OPTIONS.map((option, key) => {
        return <MenuItem key={key} value={option}>{option}</MenuItem>
    });

    const { apiStore, appStore } = useStore();

    const handleSortOptionChange = (event) => {
        setSortOption(event.target.value);
    }

    const handleSort = () => {

        console.log(sortOption)
        switch (sortOption) {
            case SORT_OPTIONS[0]: // Distance
                 shelterData = shelterData.sort((a, b) => {
                    return a.distanceToUserLocation - b.distanceToUserLocation
                })
                setShelterData(shelterData.slice())
            break;
            case SORT_OPTIONS[1]: // Rating (ascending)
                shelterData.sort((a, b) => {
                    return a.avg_rating - b.avg_rating
                })
                setShelterData(shelterData.slice())
            break;
            case SORT_OPTIONS[2]: // Rating (descending)
                shelterData.sort((a, b) => {
                    return b.avg_rating - a.avg_rating
                })
                
                setShelterData(shelterData.slice())
            break;
            case SORT_OPTIONS[3]: // Bookmark (descending)
                    shelterData = shelterData.sort((a, b) => {
                    return b.num_of_bookmarks - a.num_of_bookmarks
                })
                setShelterData(shelterData.slice())
            break;
            case SORT_OPTIONS[4]: // Reviews / comments (descending)
                    shelterData = shelterData.sort((a, b) => {
                    return b.num_of_comments - a.num_of_comments
                })
                setShelterData(shelterData.slice())
            break;
            case SORT_OPTIONS[5]: // name (alphabetically)
                shelterData = shelterData.sort((a, b) => a.title > b.title ? 1 : b.title > a.title ? -1 : 0)
                setShelterData(shelterData.slice())
            break;
            default:
        }
    }

    const handleQueryChange = (event) => {
        setQuery(event.target.value);
    }

    const handleSearch = () => {
        // TODO : add functionality to revert search result and show all shelters before search. 
        console.log("filter shelter: " + shelterData)
        shelterData = shelterData.filter(data => {
            console.log("title and query: ", data.title, query)
                return data.title === query
        })
        console.log("filter shelter: " + shelterData)
        setShelterData(shelterData)
    }

    const handleFilterByAmenityTags = async() => {
        const appStoreShelterList = appStore.shelterDataList
        if (selectedAmenityTags.length == 0) {
            setShelterData(appStoreShelterList)
            return
        }
        if (!appStoreShelterList) {
            return
        }

        const matchingRes = []
        const promises = []

        const commentFilter = async(element) => {
            const reviewsDataResponse = await apiStore.loadComment(element.post_id);
            const commentUtilities = reviewsDataResponse.map(comment => comment.tags).flat(1)
            if (commentUtilities) {
                if (commentUtilities.some(tag => selectedAmenityTags.includes(tag))) {
                    matchingRes.push(element)
                }
            }
        }
        for (const element of appStoreShelterList) {
            let isMatch = false
            if (element['utilities'].length > 0) {
                const utilitiesData = element['utilities']
                isMatch = utilitiesData.some(tag => selectedAmenityTags.includes(tag))
                if(isMatch) {
                    matchingRes.push(element)
                }
            }
            if (!isMatch) {
                promises.push(commentFilter(element))
            }
        }
        await Promise.all(promises)
        console.log('matchingRes', matchingRes)
        setShelterData(matchingRes)
    }

    const toggleFilterByAmenityDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setFilterByAmenityDrawerOpen(open);
    };

    const toggleSortDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }

        if (!open) handleSort()
        setSortDrawerOpen(open);
    };

    const sortOptionEles = SORT_OPTIONS.map(optionName => {
        return <SortOption key={optionName} optionName={optionName} sortOption={sortOption} setSortOption={setSortOption}/>
    })
    

    return (
        
        <Box sx={{width: "100%", borderRadius: "10px", border: "1px solid rgba(228, 228, 228, 0.6)"}}>
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                wrap="nowrap"
                style={{position: "relative"}}>

                <Grid item xs={3}>
                    <Grid 
                        container
                        direction="column">
                        <Typography >Currenly sorted by: </Typography>
                        <Typography>{sortOption}</Typography>
                    </Grid>
                </Grid>

                <Grid item xs={6} md={8}>
                    <TextField id="outlined-basic" label="Search" variant="outlined" onChange={handleQueryChange} fullWidth/>
                </Grid>
                
                <SearchIcon 
                    onClick={handleSearch}
                    style={{width: "30px", height: "30px", cursor: "pointer", position: "absolute", right: "0", marginRight: "1em"}}
                />
            </Grid>

            <Grid
                item
                container 
                justifyContent="space-around" 
                alignItems="center"
                style={{width:  "100%"}}
                >

                <>
                    <Button variant='outlined' 
                        onClick={toggleSortDrawer(true)}>
                        General Sort
                    </Button>
                    <SwipeableDrawer
                        anchor={"bottom"}
                        open={sortDrawerOpen}
                        onOpen={toggleSortDrawer(true)}
                        onClose={toggleSortDrawer(false)}
                    >
                        <Grid
                            style={{padding: "20px", marginBottom: "100px"}}
                        >
                            {sortOptionEles}
                        </Grid>
                    </SwipeableDrawer>
                </>

                <>
                    <Button variant='outlined' 
                        onClick={toggleFilterByAmenityDrawer(true)}>
                        Filter
                    </Button>
                    <SwipeableDrawer
                        anchor={"bottom"}
                        open={filterByAmenityDrawerOpen}
                        onOpen={toggleFilterByAmenityDrawer(true)}
                        onClose={toggleFilterByAmenityDrawer(false)}
                    >
                        <Grid
                            style={{padding: "20px", marginBottom: "100px"}}
                        >
                            <AmenityFilterTab 
                                selectedAmenityTags={selectedAmenityTags} 
                                setSelectedAmenityTags={setSelectedAmenityTags}
                                displayShowResultButton={true}
                                handleFilter={handleFilterByAmenityTags}/>
                        </Grid>
                    </SwipeableDrawer>
                </>


            </Grid>
        </Box>
    );
};

ShelterDisplayControlWidget.propTypes = {};

export default ShelterDisplayControlWidget;