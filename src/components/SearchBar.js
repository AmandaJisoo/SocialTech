import {React, useState} from 'react';
import { FILTER_OPTIONS } from '../utils/utilityFunctions';
import { Grid } from '@mui/material';

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({setShelterData, shelterData}) => {
    const [filterOption, setFilterOption] = useState(FILTER_OPTIONS[0]);
    const [query, setQuery] = useState("");

    const filterMenuItems = FILTER_OPTIONS.map((option, key) => {
        return <MenuItem key={key} value={option}>{option}</MenuItem>
    });

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
        handleSort(event.target.value)
    }

    const handleSort = (sortIndicator) => {

        console.log(sortIndicator)
        switch (sortIndicator) {
            case "Current Location":
                const result = shelterData.sort((a, b) => {
                    return a.distanceToUserLocation - b.distanceToUserLocation
                })
                console.log("location sortedres:", result)
                setShelterData(result)
            break;
            case "Star Rating":
                const result2 = shelterData.sort((a, b) => {
                    return a.starRating - b.starRating
                })
                console.log("starrating sortedres:", result2)
                setShelterData(result2)
            break;
            default:
        }
    }

    const handleQueryChange = (event) => {
        setQuery(event.target.value);
    }

    const handleSearch = () => {
        
    }

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
                        value={filterOption}
                        onChange={handleFilterChange}
                        label="Filter by"
                      >
                          {filterMenuItems}
                      </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={6} md={8}>
                    <TextField id="outlined-basic" label="Search" variant="outlined" fullWidth/>
                </Grid>
                
                <SearchIcon 
                    onClick={handleSearch}
                    style={{width: "30px", height: "30px", cursor: "pointer", position: "absolute", right: "0", marginRight: "1em"}}
                />
            </Grid>
        </Box>
    );
};

SearchBar.propTypes = {};

export default SearchBar;