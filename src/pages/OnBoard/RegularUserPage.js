import { React, useContext } from 'react';
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

const RegularUserPage = () => {
    const navigate = useNavigate();

    const ctx = useContext(OnBoardContext);

    const genderMenuItems = text.onboard.regular.genderOptions.map(val => {
        return <MenuItem value={val}>{val}</MenuItem>
    })
    
    const stateMenuItems = text.usStates.map(val => {
        return <MenuItem value={val}>{val}</MenuItem>
    })

    return( 
        <>
            <Grid style={{maxWidth: "50em"}}>
                <Typography variant="h4">{text.onboard.regular.prompt}</Typography>
                
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                      <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
                      <Select 
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={ctx.gender}
                        label="Gender"
                        onChange={ctx.handleGenderChange}
                      >
                          {genderMenuItems}
                      </Select>
                </FormControl>
                <Grid
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
                        onChange={ctx.handleCityChange}
                    />
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-standard-label">State</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="State"
                        value={ctx.state}
                        onChange={ctx.handleStateChange}
                      >
                          {stateMenuItems}
                      </Select>
                    </FormControl>
                </Grid>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="email"
                    label="email"
                    type="email"
                    id="email"
                    onChange={ctx.handleEmailChange}
                  />
                <Grid
                    container
                    justifyContent="flex-start"
                    alignItems="center">
                    <Typography>{text.onboard.regular.tagPrompt}</Typography>
                </Grid>
                
                {/* place holder tags. Need  */}
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    style={{margin: "20px 0 40px 0"}}>
                    <TagContainer tagData={text.onboard.tags} isSelectable={true}/>
                </Grid>

                <Button variant='contained' onClick={() => {
                    navigate("/app/onboard/select-account-type")
                    ctx.handleBack()
                }}>
                    Back
                </Button>
                <Button variant='contained' onClick={() => {
                    ctx.handleNext()
                    navigate("/app/onboard/completed")
                }}>
                    Continue
                </Button>
            </Grid>
        </>
    )
}

export default RegularUserPage;
