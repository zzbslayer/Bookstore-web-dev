import React, {Component} from 'react';
import { Button, Input } from 'mdbreact';
import { proxy } from '../../Global'

class CartRow extends Component{
    constructor(props){
        super(props)
        this.changeAmount = this.props.changeAmount
        this.changeSelect = this.props.changeSelect
        this.state={
            cartid: this.props.cartid,
            bookid: this.props.bookid,
            href: this.props.href,
            imgsrc: this.props.imgsrc,
            bookname: this.props.bookname,
            price: this.props.price,
            amount: this.props.amount,
            select: this.props.select,
            edit:false,
        }
    }

    fmoney(s, n=2){
        if(s==='')
           return;
        n = n > 0 && n <= 20 ? n : 2;   
        s = parseFloat((s + "").replace(/[^\d.-]/g, "")).toFixed(n) + "";   
        let l = s.split(".")[0].split("").reverse(),   
        r = s.split(".")[1];   
        let t = "";   
        for(let i = 0; i < l.length; i ++ ) {   
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");   
        }   
        return t.split("").reverse().join("") + "." + r;   
    } 

    handleSelect = (e) => {
        this.setState({select: !this.state.select});
        this.changeSelect(this.props.cartid);
    }

    handleChange = (e) =>{
        this.setState({[e.target.name]:e.target.value})
        this.changeAmount(this.props.cartid, e.target.value)
        console.log(e.target.name)
    }

    handleDelete = () => {
        this.props.deleteBook(this.props.cartid);
    }

    handleEdit = () => {
        this.setState({edit:true});
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        if (this.state.amount!==""){
            let data = "bookid="+encodeURIComponent(this.state.bookid)+
                    "&count="+encodeURIComponent(this.state.amount)
            fetch(proxy+"/user/cart/edit",{
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                  },
                body: data
            })
            .then(res => res.json())
            .then(
            (result) => {
                console.log(result)
                this.setState({edit:false});
            },
            (error) => {
                alert("Edit Failed.")
                this.setState({
                    error
                });
            }
            )
        }
        else{
            const link = document.createElement("a")
            link.onClick = this.handleError()
            link.click()
        }
    }

    render(){
        let price = "￥"+ this.fmoney(this.state.price)
        let sum = "￥" + this.fmoney(this.state.price * 100 * this.state.amount / 100)
        let edit = this.state.edit
        if (!edit){
            return (
            <tr>
            <td>
                <input type="checkbox" checked={this.state.select} onChange={this.handleSelect}/>
            </td>
            <td>
                <img src={this.state.imgsrc} alt="imgsrc" className="small-img"/>
            </td>
            <td>
                <div className="bold">
                {this.state.bookname}
                </div>
            </td>
            <td>
                <div className="bold">
                {price}
                </div>
            </td>
            <td>
                {this.state.amount}
            </td>
            <td>
                <div style={{width:150}}>
                <Button color="primary" onClick = {this.handleEdit}>Edit&nbsp;<i className="fa fa-pencil" aria-hidden="true"></i></Button>
                </div>
            </td>
            <td>
                <div className="bold price">
                {sum}
                </div>
            </td>
            <td>
                <div style={{width:147}}>
                <Button color="danger" onClick = {this.handleDelete}>Delete&nbsp;<i className="fa fa-trash" aria-hidden="true"></i></Button>
                </div>
            </td>
            </tr>
            );
        }
        else{
            return(
                <tr>
            <td>
                <input type="checkbox" checked={this.state.select} onChange={this.handleSelect}/>
            </td>
            <td>
                <img src={this.state.imgsrc} alt="imgsrc" className="small-img"/>
            </td>
            <td>
                <div className="bold">
                {this.state.bookname}
                </div>
            </td>
            <td>
                <div className="bold">
                {price}
                </div>
            </td>
            <td>
                <div style={{width:50}}>
                <Input type="number" defaultValue={String(this.state.amount)} placeholder="Amount" name="amount" onChange={this.handleChange}/>
                </div>
            </td>
            <td>
            <div style={{width:150}}>
                <Button color="primary" onClick = {this.handleSubmit}>Submit&nbsp;<i className="fa fa-check" aria-hidden="true"></i></Button>
                </div>
            </td>
            <td>
                <div className="bold price">
                {sum}
                </div>
            </td>
            <td>
                <div style={{width:147}}>
                <Button color="danger" onClick = {this.handleDelete}>Delete&nbsp;<i className="fa fa-trash" aria-hidden="true"></i></Button>
                </div>
            </td>
            </tr>
            );
        }
        
    }
}
export default CartRow