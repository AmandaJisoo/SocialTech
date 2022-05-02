import {React, useEffect, useState} from 'react';
import { SORT_OPTIONS } from '../utils/utilityFunctions';
import { Grid, Button } from '@mui/material';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import AmenityFilterTab from './AmenityFilterTab';
import SortOption from './SortOption';
import Select from '@mui/material/Select';
import { useStore } from '../pages/Hook';

const ShelterDisplayControlWidget = ({setShelterData, shelterData, setIsLoaderActive = () => {}}) => {
    const { apiStore, appStore } = useStore();
    const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
    const [query, setQuery] = useState(appStore.zipcode);
    const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
    const [filterByAmenityDrawerOpen, setFilterByAmenityDrawerOpen] = useState(false);
    const [selectedAmenityTags, setSelectedAmenityTags] = useState([]);
    const [searchBarOption, setSearchBarOption] = useState('zipcode');
    console.log("searchBarOption", searchBarOption)
    console.log('shelterData', shelterData)


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
    useEffect(() => {
        console.log("use called")
        handleSort()
    }, [sortOption])

    const handleQueryChange = (event) => {
        const searchQuery = event.target.value
        console.log("searchQuery", searchQuery)
        setQuery(searchQuery);
        // const lowerSearchQuery = searchQuery.toLowerCase();
        // shelterData = appStore.shelterDataList.filter(data => {
        //     console.log("title and query: ", data.title, searchQuery)
        //     //TODO: Amanda here for query
        //         return data.title.toLowerCase().includes(lowerSearchQuery) ||
        //             data.zipcode.toLowerCase().includes(lowerSearchQuery) ||
        //             data.city.toLowerCase().includes(lowerSearchQuery)
        // })
        // setShelterData(shelterData)
    }

    useEffect(() => {
        setQuery(appStore.zipcode)
    }, [appStore.zipcode])

    const handleSearch = async() => {
        let responseOfQuery = []
        if (searchBarOption === 'city') {
            setIsLoaderActive(true);
            console.log('query when searching city', query)
            responseOfQuery = await apiStore.getShelterByCity(query)
        } else if (searchBarOption === 'zipcode'){//it is zipcode
            setIsLoaderActive(true);
            responseOfQuery = await apiStore.loadOverview(query, query)
            console.log('responseOfQuery zipcode', responseOfQuery)
        } else {
            
        }
        appStore.setShelterDataList(responseOfQuery)
        setShelterData(responseOfQuery)
        setIsLoaderActive(false);
    }

    //TODO: AMANDA wrong results are here?
    const handleFilterByAmenityTags = async() => {
        setFilterByAmenityDrawerOpen(false)
        const appStoreShelterList = appStore.shelterDataList
        if (selectedAmenityTags.length === 0) {
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
        return <SortOption key={optionName} optionName={optionName} sortOption={sortOption} setSortOption={(option) => {
            setSortOption(option)
            setSortDrawerOpen(false)
        }}/>
    })
    
    const handleChange = (event) => {
        setSearchBarOption(event.target.value);
    };

    return (
        <Box sx={{width: "100%", borderRadius: "10px" }}>
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                wrap="nowrap"
                style={{position: "relative"}}>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">option</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchBarOption}
                        label="option"
                        onChange={handleChange}
                        >
                        <MenuItem value={'city'}>city</MenuItem>
                        <MenuItem value={'zipcode'}>zipcode</MenuItem>
                        <MenuItem value={'name'}>name</MenuItem>
                        </Select>
                    </FormControl>
                    </Box>
                <Grid item xs={12} md={12}>
                    <TextField onKeyDown={(e) => e.keyCode === 13 && handleSearch()} id="outlined-basic" value={query} label="Search" variant="outlined" onChange={handleQueryChange} fullWidth/>
                </Grid>
    
                <SearchIcon 
                    onClick={handleSearch}
                    style={{width: "30px", height: "30px", cursor: "pointer", position: "absolute", right: "0", marginRight: "1em"}}
                />
            </Grid>
                <>
                    <Button variant='outlined' 
                        onClick={toggleFilterByAmenityDrawer(true)}
                        style ={{marginRight:"10px", marginTop:"15px"}}>
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
                <>
                    <Button variant='outlined' 
                        onClick={toggleSortDrawer(true)}
                        style={{marginTop:"15px"}}>
                        Sort: {sortOption}
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
        </Box>
    );
};

ShelterDisplayControlWidget.propTypes = {};

export default ShelterDisplayControlWidget;