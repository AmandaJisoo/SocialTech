import {React } from 'react';
import { Grid, Button, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import appTheme from '../theme/appThemeMui';
import Box from '@mui/material/Box';
import { Navigate, useNavigate } from 'react-router-dom';
const public_url = process.env.PUBLIC_URL


const team_info = [
    {
        name: "Yichi Zhang",
        role: "SDE",
        img_src: "/assets/imgs/about_us/yichi.png"
    },
    {
        name: "Amanda Park",
        role: "SDE",
        img_src: "/assets/imgs/about_us/amanda.png"
    },
    {
        name: "Lyons Lu",
        role: "SDE",
        img_src: "/assets/imgs/about_us/lyons.png"
    },
    {
        name: "Jerray Wu",
        role: "Designer",
        img_src: "/assets/imgs/about_us/jerray.jpg"
    },
]

const teamInfoEle = () => {
    return team_info.map((info) => {
        return (
            <Grid
                container
                direction="column" 
                justifyContent="center" 
                alignItems="center"
                style={{width: "200px"}}>
                    <img src={public_url + info.img_src} alt='avatar' />
                    <Typography>{info.name}</Typography>    
                    <Typography>{info.role}</Typography>    
            </Grid>
        )
    })
}

const AboutUs = ( )=> {
    const navigate = useNavigate()

    return (
        <Grid
            container
            direction="column" 
            justifyContent="flex-start" 
            alignItems="center"
            style={{
                padding: "100px 0",
                background: "linear-gradient(180deg, rgba(172, 224, 249, 0.6) 0%, rgba(255, 241, 235, 0.8) 44.27%, rgba(255, 213, 200, 0.6) 79.69%)"}}>
            
            <Grid
                container
                direction="column" 
                justifyContent="flex-start" 
                alignItems="center"
                style={{ width: "80vw", maxWidth: "50em"}}
                rowSpacing={5}
                >

                {/* header */}
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    wrap="nowrap"
                    >
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        wrap="nowrap"
                        sx={{alignItems: { xs: 'center', sm: 'center', md: 'flex-start' }}}
                        >
                        <Typography 
                            variant='h1' 
                            style={{fontWeight: "700", color: appTheme.palette.primary.main}}>Shelp</Typography>
                        <Typography 
                            variant='h2'
                            style={{fontWeight: "500"}}>
                                We want you to live better in Homeless Shelter!</Typography>
                        <Typography 
                            variant='h2'
                            style={{fontWeight: "500"}}>
                                Find Homeless Shelters to help you! Make Shelters more helpful!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate("/app/dashboard")
                            }}
                            style={{color: "white", marginTop: "12px"}}
                            >
                            Explore Shelters
                        </Button>
                    </Grid>
                
                    <Box sx={{display: { xs: 'none', sm: 'none', md: 'block' }}}>
                        <img 
                            src={public_url + '/assets/imgs/about_us/logo_transparent.jpg'} 
                            alt='app logo'
                            style={{cursor: 'pointer'}}
                            onClick={() => {
                                navigate("/app/dashboard")
                            }} />
                    </Box>
                
                </Grid>
                {/* challenge */}
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    wrap="nowrap">
                    <Box sx={{display: { xs: 'none', sm: 'none', md: 'block' }}}>
                        <img
                            src={public_url + "/assets/imgs/about_us/challenge.png"}
                            alt='homeless sketch'
                            style={{width: "257px", height: "124px"}}/>
                    </Box>
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        wrap="nowrap"
                        sx={{alignItems: { xs: 'center', sm: 'center', md: 'flex-start' }}}>
                        <Typography variant='h1' style={{fontWeight: "700", marginBottom: "1rem"}}>Challenge</Typography>

                        <Box sx={{display: { xs: 'block', sm: 'block', md: 'none' }}}>
                            <img
                                src={public_url + "/assets/imgs/about_us/challenge.png"}
                                alt='homeless sketch'
                                style={{width: "257px", height: "124px"}}/>
                        </Box>

                        <Typography style={{fontSize: "1.5rem"}}>How might individuals in need of temporary shelter gain better access to shelter information, so that they can make better informed decisions about the condition and risk before arriving?</Typography>
                    </Grid>
                </Grid>
                
                {/* solution */}
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    wrap="nowrap">
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        wrap="nowrap"
                        sx={{alignItems: { xs: 'center', sm: 'center', md: 'flex-start' }}}>
                        <Typography variant='h1' style={{fontWeight: "700", marginBottom: "1rem"}}>Solution</Typography>
                        <Typography style={{fontSize: "1.5rem"}}>Social platform for people in need of shelter to rate, comment, and search for suitable shelters.</Typography>
                        <ul style={{marginLeft: "-20px", fontSize: "1.2rem"}}>
                            <li>Custom search & sort</li>
                            <li>Basic five star rating system</li>
                            <li>Official shelter account authentication</li>
                            <li>Tag rating system for utilities & Comments</li>
                        </ul>

                        
                        <Box sx={{display: { xs: 'block', sm: 'block', md: 'none' }}}>
                            <img 
                                src={public_url + "/assets/imgs/about_us/phone2.jpg"} 
                                alt='prototype'
                                />
                        </Box>
                    </Grid>
                    <Box sx={{display: { xs: 'none', sm: 'none', md: 'block' }}}>
                        <img 
                            src={public_url + "/assets/imgs/about_us/phone1.jpg"} 
                            alt='prototype'
                            style={{borderRadius: "28px"}} />
                    </Box>
                
                
                </Grid>

                {/* outcome */}
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    wrap="nowrap">

                    <Box 
                        sx={{display: { xs: 'none', sm: 'none', md: 'block' }}}
                        style={{marginRight: "30px"}}>
                        <img 
                            src={public_url + "/assets/imgs/about_us/phone2.jpg"} 
                            alt='prototype'
                            style={{borderRadius: "28px"}}
                            />
                    </Box>

                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        sx={{alignItems: { xs: 'center', sm: 'center', md: 'flex-start' }}}>
                        
                        <Typography variant='h1' style={{fontWeight: "700", marginBottom: "2rem"}}>Outcome</Typography>
                        <Typography style={{fontSize: "1.2rem"}}>We want to provide more detailed information on shelter but not just simple star rating.</Typography>
                        <Typography style={{ fontSize: "1.2rem"}}>We want to provide Platform for sharing experience on specific shelter could reduce one’s concern/ fear on making visits on sheltersWe don’t want one bad experience or rumors on shelters make people hesitant to visit shelter.</Typography>
                        
                        <Box sx={{display: { xs: 'block', sm: 'block', md: 'none', marginTop: "20px"}}}>
                            <img 
                                src={public_url + "/assets/imgs/about_us/phone2.jpg"} 
                                alt='prototype'
                                style={{borderRadius: "28px"}}
                                />
                        </Box>
                    </Grid>
                
                
                </Grid>
                {/* team info */}
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    {teamInfoEle()}
                </Grid>

                {/* footer */}
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{display: { xs: 'none', sm: 'none', md: 'flex' }}}>

                    <img src={public_url + "/assets/imgs/about_us/ischool.png"} alt='ischool logo' />
                    <Grid   
                    container
                    direction="row"
                     wrap="nowrap" 
                     justifyContent='space-around'
                     style={{width: "60%"}}>
                        <Typography variant='h4' fontWeight={450}>Team Social Tech</Typography>
                        <Typography variant='h4' fontWeight={450}>2022 Spring Capstone</Typography>
                    </Grid>
                
                </Grid>

                {/* footer for mobile*/}
                <Grid
                    item
                    container
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{display: { xs: 'flex', sm: 'flex', md: 'none' }}}
                    rowSpacing={3}>

                    <Grid item>
                        <img src={public_url + "/assets/imgs/about_us/ischool.png"} alt='ischool logo' />
                    </Grid>
                    <Grid item>
                        <Typography variant='h2' fontWeight={450}>Team Social Tech</Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant='h2' fontWeight={450}>2022 Spring Capstone</Typography>
                    </Grid>
                
                </Grid>
            </Grid>
        </Grid>
    )   
};

export default AboutUs
