import React, { Component } from 'react';

// MaterialUI compoments
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import FilledInput from '@material-ui/core/FilledInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import AlertDialog from './AlertDialog';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
import { InputAdornment, OutlinedInput } from '@material-ui/core';

const paperStyle = {
    color: "black",
};
class NewItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemName: "",
            itemPrice: "",
            itemQuantity:"",
            paymentAddress: "",
            showAlert: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.createNewItem = this.createNewItem.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.name === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        
    }

    createNewItem = async (event) => {
       /**
         * Creating new product based on user inputs and storing it on smart contract 
         */
        let result = await this.props.productManager.methods.createProduct(this.state.itemName, this.state.itemPrice,this.state.itemQuantity).send({ from: this.props.account});
        this.setState({
            showAlert: true,
            paymentAddress: result.events.ProductStateChanged.returnValues.productPaymentAddress
        });
        this.state.itemName = ""
    this.state.itemPrice = ""
     this.state.itemQuantity = ""
       
// Updating list of products from parent component (so that table is automatically updated)
        this.props.updateProducts()
        
    }

    toggleAlert() {
        this.setState(state => ({
            showAlert: !state.showAlert
        }));
     }

    

    render() {
        return (
            <Container style={{marginTop:'15vh', marginBottom:'40vh','width': '50vw' ,height:"40vh", color: 'blue'}}>
                <Paper elevation={3} style={paperStyle} >
                    <Grid container direction="column" justifyContent="space-evenly" alignItems="center" spacing={3}>
                        <Grid item xs={12} color="blue">
                            <h1>Add new drugs to the inventory:</h1>
                        </Grid>
                        <Grid item xs={10}></Grid>
                        <Grid item xs={10} style={{ 'textAlign': 'center' }}>
                        <TextField required label='Drug name' variant='outlined' name="itemName" value={this.state.itemName} onChange={this.handleInputChange} />
                        </Grid>
                        <Grid item xs={10} style={{ 'textAlign': 'center' }}>
                        <TextField InputProps={{startAdornment: <InputAdornment position="start">Gwei</InputAdornment>,}} required label='Product Price' variant='outlined' name="itemPrice" value={this.state.itemPrice} onChange={this.handleInputChange} />  
                        
                        </Grid>
                        <Grid item xs={10} style={{ 'textAlign': 'left' }}>
                            <TextField required label='Quantity' variant='outlined' name="itemQuantity" value={this.state.itemQuantity} onChange={this.handleInputChange} />
                        </Grid>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={10}>
                            <Button variant="contained" color="primary" onClick={this.createNewItem}>
                                Create new product
                            </Button>
                </Grid>
             </Grid>
            </Paper>
            <AlertDialog show={this.state.showAlert} price={this.state.itemPrice} paymentAddress={this.state.paymentAddress} closeAlertDialog={this.toggleAlert}/>
            </Container>
        );
    }
}


export default NewItem;
