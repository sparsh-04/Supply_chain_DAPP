import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';
import './styles.css';
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



    return (
        <div className='center'>
            <AppBar style={appBarStyle}>
                <Toolbar style={{marginLeft:"30vw"}}>
                    <h1 style={h1style}>Narcotics Supply Chain Management</h1>
                </Toolbar>
            </AppBar>
        </div>
    );
}