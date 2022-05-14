import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../pages/Hook';
import { observer } from 'mobx-react';

const public_url = process.env.PUBLIC_URL;

const AppMenu = observer(({user, setUser, userStatus}) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const { appStore, apiStore } = useStore(); 
  console.log("userStatus", userStatus)
  const [profilePath, setProfilePath] =  React.useState("")
  // const [userStatus, setUserStatus] =  React.useState("")
  const [userRole, setUserRole] = React.useState(null);

  
  React.useEffect(() => {
    (async () => {console.log("appStore.username", appStore.username)
    const currentRole = await apiStore.getUserStatus(appStore.username)
    console.log("currentRole", currentRole)
    setUserRole(currentRole.UserStatus)
    let path = currentRole && currentRole.UserStatus === "shelter_owner"?  "app/org-user-profile/" + user: "/app/regular-user-profile/" + user 
    console.log("path", path)
    console.log("currentRole", currentRole)
    setProfilePath(path)
  })()
  }, [appStore.username])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = async () => {
    try {
        await Auth.signOut();
        setUser(null)
        navigate("/app/dashboard")
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
  //AMANDA EDIT MENU
  const mobileAppBarMenuItem = () => {
      return (
          <>
            <MenuItem 
                onClick={() => {
                    handleCloseNavMenu()
                    navigate("/app/dashboard")
                }}>
                 <Typography textAlign="center">Dashboard</Typography>
            </MenuItem>
            <MenuItem 
                onClick={() => {
                    handleCloseNavMenu()
                    navigate("/app/about-us")
                }}>
                 <Typography textAlign="center">About Us</Typography>
            </MenuItem>
            {userRole == "admin" && 
            <MenuItem 
                onClick={() => {
                    handleCloseNavMenu()
                    navigate("/app/application")
                }}>
                <Typography textAlign="center">Application</Typography>
            </MenuItem>
            }
          </>
      )
  }

  const deskTopAppBarMenuItem = () => {
    return (
        <>
          <Button
            onClick={() => {
                handleCloseNavMenu()
                navigate("/app/dashboard")
            }}
            sx={{ my: 2, color: 'white', display: 'block' }}>
            Dashboard
         </Button>
          <Button
            onClick={() => {
                handleCloseNavMenu()
                navigate("/app/about-us")
            }}
            sx={{ my: 2, color: 'white', display: 'block' }}>
            About Us
        </Button>
        {userRole == "admin" && 
        <Button
            onClick={() => {
                handleCloseNavMenu()
                navigate("/app/application")
            }}
            sx={{ my: 2, color: 'white', display: 'block' }}>
            Application
        </Button>}
        </>
    )
}

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            <img
              src={public_url + '/assets/imgs/about_us/logo_transparent.jpg'}
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, width: "100px", height: "100px"}}
              alt='app logo'
              style={{width: "60px", height: "50px"}}/>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {mobileAppBarMenuItem()}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <img
              src={public_url + '/assets/imgs/about_us/logo_transparent.jpg'}
              alt='app logo'
              style={{width: "60px", height: "50px"}}/>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {deskTopAppBarMenuItem()}
          </Box>

          {user ?
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>

                <Avatar alt="user avatar" src={appStore.userProfilePic[appStore.username]} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem  onClick={() => {
                    handleCloseNavMenu()
                    navigate(profilePath)
                }}>
                    <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem  onClick={() => {
                    handleCloseNavMenu()
                    handleSignOut()
                }}>
                    <Typography textAlign="center">Log out</Typography>
                </MenuItem>
            </Menu>
          </Box> : 
          <Button
              onClick={() => {
                  handleCloseNavMenu()
                  navigate("/app/auth/sign-in")
              }}
              sx={{ my: 2, color: 'white', display: 'block' }}>
              Sign In
          </Button> }
        </Toolbar>
      </Container>
    </AppBar>
  );
});
export default AppMenu;