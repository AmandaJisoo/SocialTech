import {React, useContext, useState} from 'react';
import { Button, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import text from "../../text/text.json"
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TagContainer from '../../components/SelectableTags/TagContainer';
import OnBoardContext from './OnBoardContext';
import { Tag } from '@mui/icons-material';

const OrgOnBoardPages = {
    shelterInfoFormPage: "SHELTER_INFO_FORM_PAGE",
    shelterAdminInfoFormPage: "SHELTER_ADMIN_INFO_FORM_PAGE"
}

const OrgPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState("SHELTER_INFO_FORM_PAGE")

    const ctx = useContext(OnBoardContext);
    
    if (page === OrgOnBoardPages.shelterInfoFormPage) {
        return <ShelterInfoForm setPage={setPage} navigate={navigate} ctx={ctx}/>
    } else {
        return <ShelterAdminInfoForm navigate={navigate} setPage={setPage}/>
    }
}

const ShelterInfoForm = ({ setPage, navigate, ctx }) => {

    const [availableShelterData, setAvailableShelterData] = useState(undefined);
    const [loadingAvailableShleter, setLoadingAvailableShleter] = useState(false);

    const fetchAvailableShelterData = () => {
        setLoadingAvailableShleter(true);
        //fetch
        //onsuccess:
        setAvailableShelterData([{
            "text": "shleter a"
            },
            {
                "text": "shleter b"
            },
            {
                "text": "shleter c"
            }])
        setLoadingAvailableShleter(false);
    }

    const stateMenuItems = text.usStates.map(val => {
        return <MenuItem value={val}>{val}</MenuItem>
    })


    // I'm using tags temporaily to display shelters that are available for claim
    const availableShelterTags = availableShelterData ? 
        <TagContainer tagData={availableShelterData} isSelectable={true}/> :
        null;

    return(
        <>
            <Grid
                container 
                direction="column" 
                justifyContent="center" 
                style={{maxWidth: "50em"}}
                wrap="nowrap"
                rowSpacing={2}>
                <Grid item>
                    <Typography variant="h4">{text.onboard.org.prompt}</Typography>
                </Grid>

                <Grid
                    item
                    container
                    justifyContent="space-between"
                    alignItems="center">
                
                    <TextField
                        margin="normal"
                        required
                        name="City"
                        label="City"
                        type="City"
                        id="City"
                    />
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-standard-label">State</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="State"
                      >
                          {stateMenuItems}
                      </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="Zip Code"
                    label="Zip Code"
                    type="Zip Code"
                    id="Zip Code"
                    />
                </Grid>

                <Button onClick={() => {
                    fetchAvailableShelterData();
                }}>
                    Get Available Shelter
                </Button>

                {availableShelterData ?  
                <Grid>
                    
                    {availableShelterTags}

                    <Grid
                        item
                        container
                        justifyContent="flex-end"
                        alignItems="center"
                        >

                        <Button variant='contained' onClick={() => {
                            ctx.handleBack()
                            navigate("/app/onboard/select-account-type")
                        }}>
                            Back
                        </Button>
                        <Button variant='contained' onClick={() => {
                            setPage(OrgOnBoardPages.shelterAdminInfoFormPage)
                        }}>
                            Continue
                        </Button>
                    </Grid>
                </Grid> : null}
            </Grid>
        </>
    )
}

const ShelterAdminInfoForm = ({navigate, setPage}) => {

    const ctx = useContext(OnBoardContext);

    return(
        <>
            <Grid
                container 
                direction="column" 
                justifyContent="center" 
                style={{maxWidth: "50em"}}
                wrap="nowrap"
                rowSpacing={2}>
                <Grid item>
                    <Typography variant="h4">{text.onboard.org.prompt}</Typography>
                </Grid>
                <Grid item>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name={text.onboard.org.shelterScopeDropDownLabel}
                        label={text.onboard.org.shelterScopeDropDownLabel}
                        type={text.onboard.org.shelterScopeDropDownLabel}
                        id={text.onboard.org.shelterScopeDropDownLabel}
                      />
                </Grid>
                <Grid item>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    name={text.onboard.org.FoodProvideDropDownLabel}
                    label={text.onboard.org.FoodProvideDropDownLabel}
                    type={text.onboard.org.FoodProvideDropDownLabel}
                    id={text.onboard.org.FoodProvideDropDownLabel}
                    />
                </Grid>

                <Grid
                    item
                    container 
                    direction="column" 
                    justifyContent="center" 
                    alignItems="flex-start">    
                    <Typography>{text.onboard.org.tagSelectionPrompt}</Typography>
                    <Grid style={{padding: "20px"}}>
                        <TagContainer tagData={text.onboard.tags} isSelectable={false}/>
                    </Grid>
                </Grid>

                <Grid
                    item
                    container 
                    justifyContent="flex-end" 
                    alignItems="center"
                    >
                    <Button variant='contained' onClick={() => {
                        setPage(OrgOnBoardPages.shelterInfoFormPage);
                    }}>
                        Back
                    </Button>
                    <Button variant='contained' onClick={() => {
                        navigate("/app/onboard/completed")
                        ctx.handleNext()
                    }}>
                        Continue
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default OrgPage; 
