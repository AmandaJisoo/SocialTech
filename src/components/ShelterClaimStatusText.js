import { React, useState } from 'react';
import appTheme from '../theme/appTheme.json';
import InfoIcon from '@mui/icons-material/Info';
import { Grid, Button, Typography, Modal } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';

const ShelterClaimStatusText = ({ openModal, setOpenModal, claim_status }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }
    const modal = (
        <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
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
                <InfoIcon style={{ color: '#48AAAD' }}/>
            </IconButton>
            </Grid>
            <Grid item>
                <Typography style={{fontSize: "17px", color: '#48AAAD' }}>
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
                    <PendingIcon style={{ color: '#48AAAD' }}/>
            </IconButton>
            </Grid>
            <Grid item>
                <Typography style={{fontSize: "17px", color: '#48AAAD' }}>
                    Pending Verification
                </Typography>
            </Grid>
                </Button>
                {modal}
        </Grid>
    } else {
        val = 
        <Grid container direction="row" alignItems="center">
            <Grid item>
            <IconButton aria-label="business claim status">
                <CheckCircleIcon style={{ color: '#48AAAD' }}/>
            </IconButton>
        </Grid>
        <Grid item>
            <Typography style={{fontSize: "17px", color: '#48AAAD' }}>
                Claimed 
            </Typography>
        </Grid>
    </Grid>
    }

    return (
        <>
        {val}
        </>
        )
};

export default ShelterClaimStatusText;
