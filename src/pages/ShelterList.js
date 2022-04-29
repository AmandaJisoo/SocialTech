import { React } from 'react';
import { Grid } from '@mui/material';
import ShelterCard from '../components/ShelterCard/ShelterCard';
import CircularProgress from '@mui/material/CircularProgress'

const ShelterList = ({user, shelterData, setShelterData, loaderActive, bookmarks = []}) => {

    console.log("bookmark in profile page: " + bookmarks)

    const shelterCards = () => {
        return (
            (shelterData === undefined) || loaderActive ? 
                <Grid   
                container
                direction="column"
                justifyContent="center" 
                alignItems="center"
                style={{height: "80vh"}}>
                    <CircularProgress/>
                </Grid> : 
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
