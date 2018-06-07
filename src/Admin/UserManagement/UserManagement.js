import React, {Component} from 'react'
import UserRow from './UserRow'
import { proxy } from '../../Global'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

class UserManagement extends Component{
    constructor(props){
        super(props)
        this.initMsg()
        this.state={
            error:null,
            isLoaded: false,
            users: []
        }
    }

    initMsg = () => {
        if (cookies.get('JSESSIONID')==='null')
            window.location.href= "/login"
        fetch(proxy + "/admin/users/",{
            credentials: 'include',
            method:'get'
        })
        .then(res => res.json())
        .then(
        (result) => {
            this.setState({
                isLoaded: true,
                users: result
            });
            //console.log(result)
        },
        (error) => {
            this.setState({
                isLoaded: true,
                error
            });
            //console.log(error)
            }
        )
    }

    deleteUser = (username) => {
        let data = this.state.userstatus
        for (let i in data){
            if (data[i].username===username){
                data.splice(i,1)
                this.setState({userstatus: data})
                return
            }
        }
    }

    render(){
        let data = this.state.users
        return(
            <div className="big-container">
            <table className="table table-striped table-sm inside-big-container">
                <thead>
                    <tr>
                    <td>Username</td>
                    <td>Status</td>
                    <td>Action</td>
                    <td/>
                    </tr>
                </thead>
                <tbody>
                    {

                        (data===null || typeof(data)==='undefined')?<tr><td/><td/><td/><td/></tr>:data.map((user) => {
                            //console.log(user.rolename)
                            return(
                                <UserRow  deleteUser={this.deleteUser} key={user.userid} username={user.username} status={user.status} rolename={user.rolename}/>
                            );
                        },this)
                    }
                </tbody>
            </table>
            </div>
        );
    }
}
export default UserManagement