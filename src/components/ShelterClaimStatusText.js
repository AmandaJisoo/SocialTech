import { React, useState, useContext, useEffect } from 'react';
import appTheme from '../theme/appTheme.json';
import InfoIcon from '@mui/icons-material/Info';
import { Grid, Button, Typography, Modal } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import AppContext from '../AppContext';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../pages/Hook';
import { HomeRepairServiceRounded } from '@mui/icons-material';
import { Auth } from 'aws-amplify';


const ShelterClaimStatusText = ({ postId, currentUsername, modalSubTitleStatus, modalTitleStatus, openModal, setOpenModal, claim_status }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '70vw',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }
    const [userRole, setUserRole] = useState("")
    const { apiStore, appStore } = useStore();
    const [showCreateShelter, setShowCreateShelter] = useState(false)
    console.log("showCreateShelter", showCreateShelter)

    useEffect(async () => {
        console.log("res, user, postId", currentUsername, postId);
        if (appStore.usename === "") {
            setShowCreateShelter(true)
        }
        let res = await apiStore.getClaim(currentUsername, postId)
        console.log('res here', res)
        if (res == undefined) {
            setShowCreateShelter(true)
        }
    }, [postId])

    useEffect(() => {
        try {
            console.log("appCtx shelter claim", appCtx)
            if (appCtx.userStatus) {
                setUserRole(appCtx.userStatus)
                console.log("here amanda", appCtx.userStatus)
            } else {
                console.log("nono");
            }
        } catch (err) {
            console.error(err)
        }
    }, [])
    const navigate = useNavigate();
    const modelBody = "Claim the shelter to provide most upto date information about shelter including amenities"
    const appCtx = useContext(AppContext);

    const handleSignOut = async () => {
        try {
            await Auth.signOut();
            appStore.setUsername("");
            appStore.setUserFn(null)
            //setUser(null)
            navigate("/app/auth/sign-up")
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    const modal = (
        <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <IconButton onClick={() => setOpenModal(false)}>
                    <CloseIcon />
                </IconButton>
                <Typography id="modal-modal-title" variant="h6" component="h1" align="center" style={{ fontWeight: "bold", fintSize: "2rem" }}>
                    {modalTitleStatus}
                </Typography>
                {showCreateShelter ?
                    (<>
                        <Typography id="modal-modal-description" component="h2" style={{ fontWeight: "bold" }} sx={{ mt: 6 }}>
                            {modalSubTitleStatus}
                        </Typography>
                        <Typography id="modal-modal-description-2" component="h2" sx={{ mt: 4 }}>
                            {modelBody}
                        </Typography>
                        {userRole != "shelter_owner" ?
                            <Typography sx={{ mt: 3 }}>To Claim Shelter, please create a <Box component="span" fontWeight='fontWeightMedium' color='red'>new Shelter Owner account</Box> by clicking Create Shelter Ownner Account button below. Currently you are using regular user account.</Typography> :
                            <Typography sx={{ mt: 3 }}>Please claim shelters by clicking Claim Shelter button below</Typography>
                        }
                    </>) :
                    (<Typography id="modal-modal-description" component="h2" style={{ fontWeight: "bold" }} sx={{ mt: 6 }}>
                        {`You already have filed the claim for ${postId.slice(0, -6)}`}
                    </Typography>)
                }
                {userRole != "shelter_owner" ?
                    (<Grid container sx={{ mt: 3 }} alignItems="center">
                        <Button variant='outlined' style={{ marginTop: "10px", marginRight: "10px" }} onClick={() => { handleSignOut() }} >
                            Create Shelter Ownner Account
                        </Button>
                        <Button variant='outlined' style={{ marginTop: "10px" }} onClick={() => setOpenModal(false)}>
                            Cancel
                        </Button>
                    </Grid>) :
                    (<Grid container
                        justifyContent="space-around" sx={{ mt: 3 }}>
                        <Button variant='outlined' style={{ marginTop: "10px", marginRight: "10px" }} disabled={!showCreateShelter} onClick={() => navigate("/app/onboard/org-user")}>
                            Claim Shelter
                        </Button>
                        <Button variant='outlined' style={{ marginTop: "10px" }} onClick={() => setOpenModal(false)}>
                            Cancel
                        </Button>
                    </Grid>)
                }
            </Box>
        </Modal>
    )
    let val;

    if (claim_status === "no_claim") {
        val =
            <Grid container direction="row" alignItems="center">
                <Button onClick={() => setOpenModal(true)}>
                    <Grid item>
                        <IconButton aria-label="business claim status">
                            <InfoIcon style={{ color: '#48AAAD' }} />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography style={{ fontSize: "17px", color: '#48AAAD' }}>
                            Unclaimed
                        </Typography>
                    </Grid>
                </Button>
                {modal}
            </Grid>
    } else if (claim_status === "pending") {
        val =
            <Grid container direction="row" alignItems="center">
                <Button onClick={() => setOpenModal(true)}>
                    <Grid item>
                        <IconButton aria-label="business claim status">
                            <PendingIcon style={{ color: '#48AAAD' }} />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography style={{ fontSize: "17px", color: '#48AAAD' }}>
                            Pending Verification
                        </Typography>
                    </Grid>
                </Button>
                {modal}
            </Grid>
    } else if (claim_status === "claimed") {
        val =
            <Grid container direction="row" alignItems="center">
                <Grid item>
                    <IconButton aria-label="business claim status">
                        <CheckCircleIcon style={{ color: '#48AAAD' }} />
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography style={{ fontSize: "17px", color: '#48AAAD' }}>
                        Claimed
                    </Typography>
                </Grid>
            </Grid>
    } else {
        val = <></>
    }

    return (
        <>
            {val}
        </>
    )
};

export default ShelterClaimStatusText;
