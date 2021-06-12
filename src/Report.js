import React, { Component } from 'react'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import firebase from "./config/FirebaseConfig";
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

export default class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            seletedArea: 3, areas: [], shops: [], endDate: new Date(),
            startDate: new Date(), dataLoaded: false,formatedBill: [],
            reportType: ''
        }
        this.updateShops = this.updateShops.bind(this)
        this.fetchResults = this.fetchResults.bind(this)
    }
    componentDidMount() {
        firebase.getAllShops(this.updateShops)
    }
    updateShops(data) {
        let shopobj = {}
        data.forEach((t) => {
            if (Object.keys(t).length) {
                shopobj[Object.keys(t)[0]] = Object.values(t)[0]
            }
        })
        this.setState({
            areas: this.props.location.state,
            shops: shopobj
        }, () => { this.setState({ dataLoaded: true }) })
    }
    fetchResults(type) {
        this.setState({formatedBill:[],reportType:type},()=>{
            let regex = new RegExp('^' + this.state.selectedArea + '_')
            let bills = []
            let resultbill = []
            console.log(moment(this.state.startDate).format("DD/MM/YYYY"));
            console.log(moment(this.state.endDate).format("DD/MM/YYYY"));
            console.log("area data", this.state.areas);
            console.log("shops data", this.state.shops);
            for (let key in this.state.shops) {
                let obj = {}
                bills = []
                if (regex.test(key)) {
               if(type==="debit"){
                console.log("debit bills",this.state.shops[key].debitDetails)
                      bills = this.state.shops[key].debitDetails.filter((s) => {                   
                        return moment(moment(s.debitDate).format("DD/MM/YYYY")).isAfter(moment(this.state.startDate).format("DD/MM/YYYY")) && moment(moment(s.debitDate).format("DD/MM/YYYY")).isBefore(moment(this.state.endDate).format("DD/MM/YYYY")) 
                        ||( moment(moment(s.debitDate).format("DD/MM/YYYY")).isSame(moment(this.state.endDate).format("DD/MM/YYYY"))|| moment(moment(s.debitDate).format("DD/MM/YYYY")).isSame(moment(this.state.startDate).format("DD/MM/YYYY")))  ;
                    })
                }else{
                    bills = this.state.shops[key].bills.filter((s) => {
                        return moment(moment(s.modifiedDate).format("DD/MM/YYYY")).isAfter(moment(this.state.startDate).format("DD/MM/YYYY")) && moment(moment(s.modifiedDate).format("DD/MM/YYYY")).isBefore(moment(this.state.endDate).format("DD/MM/YYYY"))
                        ||(moment(moment(s.modifiedDate).format("DD/MM/YYYY")).isSame(moment(this.state.endDate).format("DD/MM/YYYY"))
                        ||moment(moment(s.modifiedDate).format("DD/MM/YYYY")).isSame(moment(this.state.startDate).format("DD/MM/YYYY"))) ;
                    })
                }
                    if(bills.length){
                        obj.shopName = this.state.shops[key].shopName
                        obj.bills = bills
                        obj.balance = this.state.shops[key].total
                    }
                    console.log(obj)
                    if(Object.keys(obj).length){
                        resultbill.push(obj)
                    }
                }
            this.setState({formatedBill:resultbill},()=>{console.log(this.state.formatedBill)})
            }
        })
    }


    render() {
        return (
            <div>
                <label>Start Date : </label>
                <DatePicker placeholderText="Start Date"
                    selected={this.state.startDate} onChange={(date) => {
                        this.setState({
                            startDate: date,
                            endDate: date
                        })
                    }} />
                <label>End Date : </label>
                <DatePicker
                    placeholderText="End Date"
                    selected={this.state.endDate}
                    onChange={(date) => {
                        this.setState({
                            endDate: date
                        })
                    }}
                    minDate={this.state.startDate}
                    showDisabledMonthNavigation />
                <Form.Group >
                    <Form.Control as="select" size="lg" defaultValue={this.state.seletedArea} onChange={(e) => {
                        this.setState({
                            selectedArea: e.target.value
                        })
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
                    <Button
                        className="buttons"
                        variant="outline-primary"
                        onClick={() => {
                            this.fetchResults("add")
                        }}
                    >
                        Add Bill Report
                        </Button>
                        <Button
                        className="buttons"
                        variant="outline-primary"
                        onClick={() => {
                            this.fetchResults("debit")
                        }}
                    >
                          Debit Bill Report
                          
                             </Button>
                </Form.Group>

                <Accordion defaultActiveKey="1">
                    {this.state.formatedBill.map((s,idx)=>{
                        return (
                        <Card key = {idx}>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            {s.shopName}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>S.No.</th>
                    <th>{this.state.reportType == 'debit' ? 'Debit' : 'Included'} Amount</th>
                    <th>{this.state.reportType == 'debit' ? 'Debit' : 'Created'} Date</th>
                    </tr>
                </thead>
                <tbody>
                    {s.bills.map((x,id)=>{
                        return(
                            <tr key = {id}>
                            <td>{id+1}</td>
                            <td>{this.state.reportType == 'debit' ? x.amount : x.billAmount}</td>
                            <td>{this.state.reportType == 'debit' ? x.debitDate : x.modifiedDate}</td>          
                        </tr>
                        )
                    })} 
                    
                    </tbody>
                </Table>
                            </Card.Body>
                        </Accordion.Collapse>
                        </Card>
                        )
                        
                    })}
                </Accordion>

            </div>
        )
    }
}
