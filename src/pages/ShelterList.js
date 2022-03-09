import React from 'react';
import PropTypes from 'prop-types';
import shelterInfo from "../mockData/shelterInfo.js"
import text from "../text/text.json"
import { Grid } from '@mui/material';
import ShelterCard from '../components/ShelterCard/ShelterCard';
import Typography from '@mui/material/Typography';
import SearchBar from '../components/SearchBar'

const ShelterList = props => {

    const shelterCards = shelterInfo.shelters.map(cardInfo => {
        return <ShelterCard shelterData={cardInfo} key={cardInfo.id}/>
    })

    return (
        <Grid
            container
            direction="column" 
            justifyContent="center" 
            alignItems="center"
            style={{height: "100vh"}}>
            <Grid
                container
                direction="column" 
                justifyContent="flex-start" 
                alignItems="center"
                spacing={5}
                wrap="nowrap"
                style={{height: "100vh", maxWidth: "50em"}}>

                <Grid item>
                    <Typography variant="h4" sx={{marginTop: "1em"}}>{text.shelterList.header}</Typography>
                </Grid>

                <Grid item>
                    <SearchBar />
                </Grid>

                <Grid item>{shelterCards}</Grid>
        </Grid>
    </Grid>
    );
};

ShelterList.propTypes = {};

export default ShelterList;