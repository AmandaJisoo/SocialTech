import {React, useState} from 'react';
import { SORT_OPTIONS } from '../utils/utilityFunctions';
import { Grid, Button, Typography } from '@mui/material';

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

const SearchBar = ({setShelterData, shelterData}) => {
    const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
    const [query, setQuery] = useState("");
    const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
    const [filterByAmenityDrawerOpen, setFilterByAmenityDrawerOpen] = useState(false);
    const [selectedAmenityTags, setSlectedAmenityTags] = useState([]);

    const sortMenuItems = SORT_OPTIONS.map((option, key) => {
        return <MenuItem key={key} value={option}>{option}</MenuItem>
    });

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
            case SORT_OPTIONS[1]: // Rating
                shelterData.sort((a, b) => {
                    return a.avg_rating - b.avg_rating
                })
                setShelterData(shelterData.slice())
            break;
            case SORT_OPTIONS[2]: // Rating (reversed)
                shelterData.sort((a, b) => {
                    return b.avg_rating - a.avg_rating
                })
                
                setShelterData(shelterData.slice())
            break;
            case SORT_OPTIONS[3]: // Favorite
                    shelterData = shelterData.sort((a, b) => {
                    return a.starRating - b.starRating
                })
                setShelterData(shelterData.slice())
            break;
            case SORT_OPTIONS[4]: // Reviewed
                    shelterData = shelterData.sort((a, b) => {
                    return a.starRating - b.starRating
                })
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

    const handleFilterByAmenityTags = () => {
        // TODO
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
        return <SortOption optionName={optionName} sortOption={sortOption} setSortOption={setSortOption}/>
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
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-standard-label">Filter by</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={sortOption}
                        onChange={handleSortOptionChange}
                        label="Filter by"
                      >
                          {sortMenuItems}
                      </Select>
                    </FormControl>
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
                                setSelectedAmenityTags={setSlectedAmenityTags}
                                displayShowResultButton={true}
                                handleFilter={handleFilterByAmenityTags}/>
                        </Grid>
                    </SwipeableDrawer>
                </>


            </Grid>
        </Box>
    );
};

SearchBar.propTypes = {};

export default SearchBar;