import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import './styles.css';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';

import logo from './drugs.png';
// import Select from 'react-select'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Header() {
    // const classes = useStyles();
    const appBarStyle = {
        backgroundColor: '#2B2A4C',
        display: 'flex',
      };

    const h1style ={
        color: "#EEE2DE",
        flexGrow : 1
    };

    const image_style = {
        width : "40px",
        // marginRight: "100px"
    }

    return (
        <div className='center'>
            <AppBar style={appBarStyle}>
                <Toolbar style={{marginLeft:"30vw", justifyContent: "space-evenly"}}>
                    <img src={logo} style={image_style} />
                    <h1 style={h1style}>Narcotics Supply Chain Management</h1>
                </Toolbar>
            </AppBar>
        </div>
    );
}