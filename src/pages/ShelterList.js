import { React } from 'react';
import { Grid } from '@mui/material';
import ShelterCard from '../components/ShelterCard/ShelterCard';
import CircularProgress from '@mui/material/CircularProgress'
import LoadingSpinner from '../components/LoadingSpinner';
import { LOADING_SPINNER_SIZE } from '../utils/utilityFunctions';

const ShelterList = ({user, shelterData, setShelterData, loaderActive, bookmarks = []}) => {

    console.log("bookmark in profile page: " + bookmarks)

    const shelterCards = () => {
        return (
            (shelterData === undefined) || loaderActive ? 
                <LoadingSpinner text={"Loading Data"} size={LOADING_SPINNER_SIZE.large} />
                : 
            shelterData.map((cardInfo) => {
                return <ShelterCard user={user} shelterData={cardInfo} key={cardInfo.post_id} isBookmarked={bookmarks.includes(cardInfo.post_id)} />
            })
        )
    }

    return (
        <Grid>
            {shelterCards()}
        </Grid>
    )
};

export default ShelterList;
