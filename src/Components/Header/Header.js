import React,{useState} from "react";
import './Header.css';
// import Avatar from '@material-ui/core/Avatar';
import {Avatar,Tooltip,Popper,Box} from "@material-ui/core"
import { auth, db, logout } from "../../lib/firebase";
import { Link as RouterLink } from 'react-router-dom'
import { Breadcrumbs, Button, Grid, Link, Typography, makeStyles } from '@material-ui/core'


function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
  }

function getInitialsFromName(fn){
    try{
        let arr = fn.split(" ");
        if (arr.length>1){
            return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
        }
        return arr[0][0].toUpperCase();
    }catch(e){
        return fn[0].toUpperCase()
    }
}

const Header = ({user,...props}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
      };

      const open = Boolean(anchorEl);
      const id = open ? 'avatar-popper' : undefined;

    const onLogOut = () => {
        setAnchorEl(null);
        logout()
    }
    return (
        <div className="app-header">
                <Button style={{marginRight:"auto",backgroundColor:"#1976d2",color:"white"}}  component={RouterLink} to="/dashboard/create">
                    Create
                </Button>

                {user.displayName?
                <Tooltip title={user.email}>
                    <p>{user.displayName}</p>
                </Tooltip>
                :user.email?
                <p>{user.email}</p>
                :
                null    
            }
                {user&&user.email&&
            <>
            <Avatar aria-describedby={id} 
             style={{backgroundColor:stringToColor(user.email),cursor:"pointer"}}
             onClick={handleClick}
              >
                  {getInitialsFromName(user.displayName||user.email)}
            </Avatar>
            <Popper
                id={id}
                open={open} 
                anchorEl={anchorEl}
                >
                <Box id="logout-content" sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                   <button onClick={onLogOut}>
                       Log out
                   </button>
                </Box>
            </Popper>
            </>
            }
        </div>
    )
}

export default Header;