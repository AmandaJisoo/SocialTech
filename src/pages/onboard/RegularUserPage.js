import { React, useContext, useEffect, useRef, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import text from "../../text/text.json"
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OnBoardContext from './OnBoardContext';
import Alert from '@mui/material/Alert';
import { useStore } from '../Hook.js';
import { DEFAULT_COUNTRY } from '../../utils/utilityFunctions';
import AppContext from '../../AppContext';
import { Auth } from 'aws-amplify';
import IconButton from '@mui/material/IconButton';
import ImageIcon from '@mui/icons-material/Image';
import ImageThumbNailWithLightBox from '../../components/ImageThumbNailWithLightBox';

const RegularUserPage = () => {
    const navigate = useNavigate();

    const onboardCtx = useContext(OnBoardContext);
    const appCtx = useContext(AppContext);
    const [errorMsg, setErrorMsg] = useState(null);
    const apiStore = useStore().apiStore;
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState([]);
    
        console.log("selected files:", selectedFile)

    const Input = styled('input')({
        display: 'none',
      });

    useEffect(() => {
        onboardCtx.setActiveStep(2)
    }, [onboardCtx, onboardCtx.activeStep])

    const selectFile = () => {
        fileInputRef.current.click()
    } 

    const handleNext = async () => {
       
        setErrorMsg(null)
        try {
            let s3Path = ""
            console.log("img", selectedFile && selectedFile.length > 0? selectedFile[0] : "")
            if (selectedFile && selectedFile.length > 0) {
                s3Path = await apiStore.uploadImageToS3(selectedFile[0])
                console.log("s3Path", s3Path)
            }
            const createAccountResult = await apiStore.createUser({
                username: appCtx.user,
                profile_pic_path: s3Path,
                user_role: "user",
            })   
            console.log("create account result: ", createAccountResult)
    
            navigate("/app/onboard/completed")
            // createAccountResult();
        } catch(err) {
            setErrorMsg(err.message)
        }
    }

    const genderMenuItems = text.onboard.regular.genderOptions.map(val => {
        return <MenuItem key={val} value={val}>{val}</MenuItem>
    })
    
    const stateMenuItems = text.usStates.map(val => {
        return <MenuItem key={val} value={val}>{val}</MenuItem>
    })

    const errorMsgEle = errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null;
    
    const selectedImagePreview = () => {
        let fileArray = Array.from(selectedFile)
        let imgArray = []
         for (let i = 0; i < fileArray.length; i++) {
            imgArray.push(URL.createObjectURL(fileArray[i]))
         }
         
        return fileArray.length === 0 ? null :
        <Grid container justifyContent='center'>
            {/* {fileArray.map(data => {
                return <Typography>{data.name}</Typography>
            })} */}
            {imgArray.map((url, index) => {
                return < ImageThumbNailWithLightBox
                        key={index}
                        index={index}
                        imgs={imgArray}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile} 
                        isDeletable={true}/>
            })}
        </Grid>
    } 

    return ( 
        <>
            <Grid style={{maxWidth: "50em", maxHeight: "100vh"}}>
                <Typography variant="h3">Please provide your proilfe img</Typography>
                <Typography>Please provide your proilfe img. If you continue without selecting, default image will be used</Typography>

                <Grid
                    container
                    direction="row" 
                    justifyContent="flex-end" 
                    alignItems="center"
                    >
                    <Grid container alignItems="center" style={{padding: "5px", justifyContent: "flex-start"}}>
                    <Box component="span" sx={{ p: 2, border: '1px solid grey', width: '70vw' }}>
                        <input
                            type="file"
                            name="file"
                            onChange={ () => {
                                console.log("selected files: ", fileInputRef.current.files)
                                setSelectedFile(Array.from(fileInputRef.current.files))
                            }}
                            accept="image/*"
                            ref={fileInputRef}
                            style={{display: "none"}}/>
                        {/* <Grid direction="row" justifyContent="flex-start" > */}
                        <Button onClick={() => selectFile()} 
                        style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}>
                            <ImageIcon onClick={() => selectFile()} style={{cursor: "pointer"}}/>
                            {selectedFile && selectedFile.length > 0? 
                            <Typography>{selectedFile[0].name}</Typography>: <Typography>No file selected yet</Typography>}
                        </Button>
                        {/* </Grid> */}
                        </Box>
                    </Grid>
                    {selectedImagePreview()}
                </Grid> 
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center">
                    <Button variant='contained' style={{marginRight: "10px", marginTop: "15px"}}onClick={() => {
                        navigate("/app/onboard/select-account-type")
                    }}>
                        Back
                    </Button>
                    <Button variant='contained' style={{marginRight: "10px", marginTop: "15px"}} onClick={() => {
                        handleNext()
                    }}>
                        Continue
                    </Button>
                </Grid>

                {errorMsgEle}
            </Grid>
        </>
    )
}

export default RegularUserPage;
