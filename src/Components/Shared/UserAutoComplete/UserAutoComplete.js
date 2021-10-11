import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles,styled,Avatar } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close'
import useAutocomplete from "@material-ui/lab/useAutocomplete";


const useStyles = makeStyles((theme) => ({
    root: {
        color:  'rgba(0,0,0,0.85)',
        fontSize: "14px"
    },
    label:{
        padding: "0 0 4px",
        lineHeight: 1.5,
        display: "block",
    },
    inputWrapper:{
        width: "100%",
        border: "1px solid #d9d9d9",
        backgroundColor:  '#fff',
        borderRadius: "4px",
        padding: "1px",
        display: "flex",
        flexWrap: "wrap",
    "&:hover": {
        borderColor:  '#40a9ff'
    },
    "&.focused": {
    borderColor:  '#40a9ff',
    boxShadow: "0 0 0 2px rgba(24, 144, 255, 0.2)"
    },
    "& input": {
    backgroundColor:  '#fff',
    color: 'rgba(0,0,0,0.85)',
    height: "54px",
    fontSize:"16px",
    boxSizing: "border-box",
    padding: "4px 6px",
    width: 0,
    minWidth: "30px",
    flexGrow: 1,
    border: 0,
    margin: 0,
    outline: 0,
  }
    },
    tag:{
        display: "flex",
        alignItems: "center",
        height: "50px",
        margin: "2px",
        lineHeight: "22px",
        backgroundColor:  '#fafafa',
        border: "1px solid #e8e8e8",
        borderRadius: "2px",
        boxSizing: "content-box",
        padding: "0 4px 0 10px",
        outline: 0,
        overflow: "hidden",      
        "&:focus": {
          borderColor:  '#40a9ff',
          backgroundColor:  '#e6f7ff'
        },
        "& span" :{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          marginLeft:"6px",
          fontSize:"18px"
        },
        "& svg": {
            marginLeft:"10px",
          fontSize: "24px",
          cursor: "pointer",
        }
    },
    listbox:{
        width: "350px",
        margin: "2px 0 0",
        padding: 0,
        position: "absolute",
        listStyle: "none",
        backgroundColor:  '#fff',
        overflow: "auto",
        maxHeight: "250px",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        zIndex: 1,
        "& li": {
          padding: "5px 12px",
          display: "flex",
          flexDirection:"row",
          alignItems:"center",
          "& div:nth-of-type(2)": {
              marginLeft:"12px",
            display:"flex",
            flexDirection:"column",
            flexGrow: 1,
            alignItems:"flex-start"
          },
          "& svg": {
            color: "transparent"
          }
        },
        "& li[aria-selected='true']": {
          backgroundColor:  '#fafafa',
          fontWeight: 600,
          "& svg" :{
            color: "#1890ff",
          }
        },
        "& li[data-focus='true']": {
          backgroundColor: '#e6f7ff',
          cursor: "pointer",
          "& svg": {
            color: "currentColor"
          }
        }
    }
}))

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

function Tag(props) {
  const { user, onDelete, ...other } = props;
  const classes = useStyles()
  return (
    <div className={classes.tag} {...other}>
        <Avatar  
             style={{backgroundColor:stringToColor(user.email),cursor:"pointer",fontWeight:"400"}}
              >
                  {getInitialsFromName(user.name||user.email)}
            </Avatar>
      <span>{user.name||user.email}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};


const UserAutoComplete = ({options,setter,...props}) => {
const classes = useStyles()

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'user-auto-complete',
    defaultValue: [],
    multiple: true,
    options: options,
    getOptionLabel: (option) => option.email,
  });

  React.useEffect(()=>{
    setter(value.map(item=>item.uid))
  },[value])

  return (
    <div className={classes.root}>
      <div {...getRootProps()}>
        {/* <label className={classes.label} {...getInputLabelProps()}>Users</label> */}
        <div ref={setAnchorEl} className={focused ? classes.inputWrapper+" focused":classes.inputWrapper}>
          {value.map((option, index) => (
            <Tag user={option} {...getTagProps({ index })} />
          ))}

          <input {...getInputProps()} />
        </div>
      </div>
      {groupedOptions.length > 0 ? (
        <ul className={classes.listbox} {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li {...getOptionProps({ option, index })}>
            <Avatar  
             style={{backgroundColor:stringToColor(option.email),cursor:"pointer",fontWeight:"400"}}
              >
                  {getInitialsFromName(option.name||option.email)}
            </Avatar>
              <div>
              {option.name?<span style={{fontSize:"17px"}}>{option.name}</span>:null}
              <span>{option.email}</span>
               
                </div>
              <CheckIcon fontSize="small" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}


export default UserAutoComplete;