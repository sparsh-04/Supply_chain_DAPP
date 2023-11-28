import React, { Component } from "react";

import ProductManagerContract from "./contracts/ProductManager.json";
import ProductPaymentHandlerContract from "./contracts/ProductPaymentHandler.json"
import getWeb3 from "./getWeb3";
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import Header from "./components/Header"
import Waiting from "./components/Waiting"
import NewItem from "./components/NewItem"
import Notification from "./components/Notification"
import ProductTable from "./components/ProductTable"
import SimpleProductTable from "./components/SimpleProductTable"
import "./App.css";



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      web3Loaded: false,
      numberOfProducts: 0,
      productsNew: [],
      productsPaid: [],
      productsDelivered: [],
      showNotification: false,
      notificationMessage: ""
    };

    this.smartContractEventListener = this.smartContractEventListener.bind(this);
    this.getAllProductsFromContract = this.getAllProductsFromContract.bind(this);
    this.toggleNotification = this.toggleNotification.bind(this);
  }

  componentDidMount = async () => {
    try {
      
      this.web3 = await getWeb3();

      this.accounts = await this.web3.eth.getAccounts();

      this.networkId = await this.web3.eth.net.getId();

      this.productManager = new this.web3.eth.Contract(
        ProductManagerContract.abi,
        ProductManagerContract.networks[this.networkId] && ProductManagerContract.networks[this.networkId].address,
      );

     
    this.productPaymentHandler = new this.web3.eth.Contract(
     ProductPaymentHandlerContract.abi,
    ProductPaymentHandlerContract.networks[this.networkId] && ProductPaymentHandlerContract.networks[this.networkId].address,
      );
    this.smartContractEventListener();
      await this.getAllProductsFromContract();
      this.interval = setInterval(() => this.getAllProductsFromContract(), 5000);

      this.setState({
        web3Loaded: true,
      });
    } catch (error) {
      alert(
        `Failed to load web3 though MetaMask. Check console for details.`,
      );
      console.error(error);
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  toggleNotification() {
    this.setState(state => ({
      showNotification: !state.showNotification
    }));
  }

  getAllProductsFromContract = async () => {
    
    await this.productManager.methods.index().call({ from: this.accounts[0] }).then((result) => {
      this.setState({
        numberOfProducts: result
      })
    });

    const productsNew = [];
    const productsPaid = [];
    const productsDelivered = [];

    const productStatuses = {
      0: 'Created',
      1: 'Paid',
      2: 'Delivered'
    }

    for (let index = 0; index < this.state.numberOfProducts; index++) {
      let product = null;

      await this.productManager.methods.products(index).call({ from: this.accounts[0] }).then((result) => {
        product = result;
      });

      let productData = {
        id: index,
        name: product.uid,
        price: product.price,
        quantity:product.Quantity,
        state: productStatuses[product.state],
        paymentAddress: product.paymentHandler
      }

   if (product.state == 0)
        productsNew.push(productData);
    else if (product.state == 1) 
        productsPaid.push(productData); 
    else if (product.state == 2) 
        productsDelivered.push(productData)
      
    }

    this.setState({
      productsNew: productsNew,
      productsPaid: productsPaid,
      productsDelivered: productsDelivered,
    });
  }

  smartContractEventListener = async () => {
  
let self = this;

    this.productManager.events.ProductStateChanged().on("data", async function (emitedEvent) { 
      let productIndex = emitedEvent.returnValues._productIndex;

      if (productIndex < self.state.numberOfProducts) {
    let products = self.state.productsNew.concat(self.state.productsPaid, self.state.productsDelivered);
      let product = null;
    products.forEach(element => {
      if (productIndex == element.id)
       product = element;
        });

        let message = "";
        if (product.state == 'Created') {
          message = "Item " + product.name + " was paid!"
        }
        else {
          message = "Item " + product.name + " was shipped to the customer!"
        }
        self.setState({
          showNotification: true,
          notificationMessage: message
        });
      }
    })
    await this.getAllProductsFromContract();
  }
  render() {
    if (!this.state.web3Loaded) {
      return (
        <div>
          <Header />
          <Waiting displayText="Connecting to Ethereum node... Please log into MetaMask." />
        </div>
      );
    }
    const wholePage = {
      backgroundColor:'#F5E8C7',
      height: '100vh',
      overflow:'auto'
    };

    const addItem = {
      height : '50vh',
      backgroundColor:'#EEE2DE',
      marginBottom: "10vh"
    }

    const mainContent = {
      marginTop: "5%",
      width: "100%",
    }
    return (
      <div style={wholePage}>
        <Header />
        <Container style={mainContent}>
          <Grid container direction="column" justifyContent="space-evenly" alignItems="center">
           <Grid item xs={10}>
           <NewItem style={addItem} productManager={this.productManager} account={this.accounts[0]} updateProducts={this.getAllProductsFromContract} />
            </Grid>
            <Grid item xs={10}>
              <ProductTable
                syle={{width:"100vw"}}
                rows={this.state.productsNew}
                title={'New'}
              /> 
             </Grid>
            <Grid item xs={10}>
              <SimpleProductTable
                rows={this.state.productsPaid}
                title={'Paid'}
                productManager={this.productManager}
                account={this.accounts[0]}
                updateProducts={this.getAllProductsFromContract}
              />
            </Grid>
            <Grid item xs={10}>
              <ProductTable
                rows={this.state.productsDelivered}
                title={'Delivered'}
              />
            </Grid>
          </Grid>
        </Container>
        <Notification open={this.state.showNotification} message={this.state.notificationMessage} handleClose={this.toggleNotification} />
      </div>
    );
  }
}

export default App;
