import React, { Component } from 'react'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal'
import firebase from "./config/FirebaseConfig";

export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = { areas: [], seletedArea: 3, shops: [], selectedShop: '', selectedShopDetails: {}, handleClose: true, showModal: false, modalMode: "", addBillNumber: '', addBillAmount: '', debitBillAmount: '' }
        this.setAreas = this.setAreas.bind(this)
        this.getShops = this.getShops.bind(this)
        this.setShops = this.setShops.bind(this)
        this.getShopDetail = this.getShopDetail.bind(this)
        this.shopsDetails = this.shopsDetails.bind(this)
        this.addBill = this.addBill.bind(this)
        this.debitAmount = this.debitAmount.bind(this)
        this.closeModel = this.closeModel.bind(this)
        this.syncToserver = this.syncToserver.bind(this)
    }
    componentDidMount() {
        firebase.getAreaDetails(this.setAreas)
    }
    setAreas(data) {
        console.log(data);
        this.setState({ areas: data.area })
    }
    getShops(e) {
        console.log(e.target.value)
        this.setState({
            seletedArea: e.target.value,
            selectedShop: ""
        }, () => { firebase.getShopDetails(this.setShops, this.state.seletedArea) })

    }
    getShopDetail(e) {
        this.setState({ selectedShop: e.target.value }, () => {
            firebase.getCorrespondingShopDetails(this.shopsDetails, this.state.selectedShop)
        })
    }
    setShops(data) {
        this.setState({ shops: data.shops })
    }
    shopsDetails(data) {
        console.log(data, this.state.selectedShop)
        this.setState({ selectedShopDetails: data.hasOwnProperty(`${this.state.selectedShop}`) ? data[`${this.state.selectedShop}`] : {} })
    }
    addBill() {
        let dummyObj = this.state.selectedShopDetails
        if (dummyObj.hasOwnProperty('total')) {
            dummyObj.total = parseInt(dummyObj.total) + parseInt(this.state.addBillAmount)
        } else {
            dummyObj.total = this.state.addBillAmount
        }
        let billobj = {
            billNumber: this.state.addBillNumber,
            billAmount: this.state.addBillAmount,
            addedDate: new Date().toLocaleString(),
            modifiedDate: new Date().toLocaleString()
        }
        if (dummyObj.hasOwnProperty('bills')) {
            dummyObj.bills.push(billobj)
        } else {
            dummyObj.bills = []
            dummyObj.bills.push(billobj)
        }
        dummyObj.shopName = this.state.shops.filter((s) => { return s.id === this.state.selectedShop })[0].shopName
        dummyObj.lastModified = new Date().toLocaleString()
        this.syncToserver(dummyObj)
    }

    debitAmount() {
        let dummyObj = this.state.selectedShopDetails
        let debitObj = {}
        debitObj.amount = this.state.debitBillAmount
        debitObj.debitDate = new Date().toLocaleString()
        if (dummyObj.hasOwnProperty('total')) {
            dummyObj.total = parseInt(dummyObj.total) - parseInt(this.state.debitBillAmount)
        } else {
            alert("There is no due")
        }
        if (!dummyObj.hasOwnProperty('debitDetails')) {
            dummyObj.debitDetails = []
        }
        dummyObj.debitDetails.push(debitObj)
        this.syncToserver(dummyObj)
    }

    syncToserver(dummyObj) {
        this.setState({
            selectedShopDetails: dummyObj,
            debitBillAmount: "",
            addBillAmount: "",
            addBillNumber: ""
        }, async () => {
            let a = await firebase.addDebitBill(this.state.selectedShopDetails, this.state.selectedShop)
            console.log(a)
        })
    }

    closeModel() {
        this.setState({
            handleClose: true,
            showModal: false
        })
    }

    render() {
        return (
            <div>
                <Button
                    className="buttons"
                    variant="outline-primary"
                    onClick={() => {
                        this.props.history.push({
                            pathname: '/report',
                            state: this.state.areas
                        })
                    }}
                >
                    Report
                             </Button>
                <Form.Group>
                    <Form.Control as="select" size="lg" defaultValue={this.state.seletedArea} onChange={(e) => {
                        console.log(e)
                        this.getShops(e);
                    }} >
                        {
                            this.state.areas.map(a => {
                                return (
                                    <option key={a.id} value={a.id}
                                    >{a.areaName}</option>
                                )
                            })
                        }
                    </Form.Control>
                    {
                        this.state.shops.length ? (
                            <Form.Control as="select" size="lg" defaultValue="0" onChange={(e) => {
                                this.getShopDetail(e);
                            }}>
                                {
                                    this.state.shops.map(a => {
                                        return (
                                            <option key={a.id} value={a.id}
                                            >{a.shopName}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        ) : ('')
                    }
                </Form.Group>
                {this.state.selectedShop ? (

                    <div>
                        <h1>{this.state.shops.filter((s) => { return s.id === this.state.selectedShop })[0].shopName}</h1>
                        {
                            this.state.selectedShopDetails ? (
                                <h3>Due Amount : {this.state.selectedShopDetails.total}</h3>
                            ) : (<h3>No Bills found</h3>)
                        }
                        <div className="buttongroup">
                            <Button
                                className="buttons"
                                variant="outline-primary"
                                onClick={() => {
                                    this.setState({
                                        showModal: true,
                                        modalMode: 'ADD',
                                        addBillNumber: '',
                                        addBillAmount: ''
                                    })
                                }}
                            >
                                ADD BILL
                             </Button>
                            <Button
                                className="buttons"
                                variant="outline-success"
                                onClick={() => {
                                    this.setState({
                                        showModal: true,
                                        modalMode: 'DEBIT',
                                        addBillNumber: '',
                                        addBillAmount: ''
                                    })
                                }}
                            >
                                DEBIT BILL
                            </Button>
                        </div>
                    </div>
                ) : ('')}
                <Modal show={this.state.showModal} onHide={this.closeModel}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalMode} Modal </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.modalMode === "ADD" ? (
                            <Form.Group>
                                <Form.Control type="text" placeholder="Bill Number" value={this.state.addBillNumber} onChange={(e) => { this.setState({ addBillNumber: e.target.value }) }} /><br />
                                <Form.Control type="text" placeholder="Bill Amount" value={this.state.addBillAmount} onChange={(e) => { this.setState({ addBillAmount: e.target.value }) }} />
                            </Form.Group>
                        ) : (<Form.Group>
                            <Form.Control type="text" placeholder="Bill Amount" value={this.state.debitBillAmount} onChange={(e) => { this.setState({ debitBillAmount: e.target.value }) }} />
                        </Form.Group>)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModel}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {
                            if (this.state.modalMode === "ADD") {
                                this.addBill()
                            }
                            else {
                                this.debitAmount()
                            }
                            this.setState({
                                handleClose: true,
                                showModal: false
                            })
                        }}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
