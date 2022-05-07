import { observer } from "mobx-react";
import ImageGallery from '../components/ImageGallery'
import { Grid } from '@mui/material';


const OrgUserProfileForm = observer(({ postID }) => {
    <Grid 
    container
    direction="column"
    justifyContent="flex-start"
    alignItems="center"
    style={{height: "100vh"}}
    >
        <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                wrap="nowrap"
                rowSpacing={2}
                style={{maxWidth: "50em", padding: "20px"}}>
            {/* <ImageGallery imgAddr={shelterPostData.profile_pic_path}/> */}
        </Grid>
    </Grid>
});
export default OrgUserProfileForm;
