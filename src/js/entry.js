import React, { Component } from "react";
import ReactDom from "react-dom";
import "../less/index.less";




let Ajax = (method, url, flag, upDate, callBack) => {
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    method = method.toUpperCase(); //转换大小写
    if (method === 'GET') {
        xhr.open(method, url + '?' + upDate, flag);
        xhr.send();
    } else if (method === 'POST') {
        xhr.open(method, url, flag);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }
    xhr.onreadystatechange = function() { // 一般放在open之后，send之前
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callBack(xhr.responseText);
            } else {
                alert('error');
            }
        }
    }
}



class SearchBar extends Component {
    onHandleChange () {
        this.props.onFilterText(this.refs.inp.value); 
    }
    render () {
        let inviteList = this.props.inviteList;
        let row = inviteList.map((ele, index) => {
            // return <strong style={ {color: '#000'} } key={index + 100}>{ele.name + ","}</strong>;
            return ele.name;
        })
        return (
            <div className="search">
                <span>你已邀请  <strong  style={ {color: '#000'} }> {row.join(",")}</strong>{row.length}人</span>
                <input ref="inp" type="text" placeholder="搜索你想邀请的人" onChange={this.onHandleChange.bind(this)}/>
            </div>
        )
    }
} 


class InviteList extends Component {
    componentWillMount () {
        this.onDealData();
    }
    shouldComponentUpdate (nextProps, nextState) {
        this.props = nextProps;
        this.onDealData();
        return true;
    }
    onDealData () {
        let row = [];
        let ele = "";
        let {data, filterText, onTouchHandle} = this.props;
        for (ele in data) { 
            if (data[ele].name.indexOf(filterText) !== -1) {
                row.push(
                    <InviteItem onTouchHandle={onTouchHandle} key={ele + 1000} message={data[ele]}></InviteItem>
                );
            }
        }
        this.row = row;
    }
    render () {
         return (
            <div className="list">
                <ul>
                    {
                        this.row
                    }
                </ul>
            </div>
        )
    }
}

class InviteItem extends Component {
    onHandleClick () {
        this.props.onTouchHandle(this.props.message.id);
    }
    render () {
        return (
            <li className="item">
                <img src={"./src/img/" + this.props.message.avatarUrl}/>
                <div className="name">{this.props.message.name}</div>
                <div className="bio">{this.props.message.bio}</div>
        <button style={this.props.message.canInvited ? {color: '#11a668', border: '1px solid #11a668'} : {color: '#8590a6', border: '1px solid #ccd8e1'}} onClick={this.onHandleClick.bind(this)}>{this.props.message.canInvited ? '邀请回答' : '取消邀请'}</button>
            </li>
        )
    }
}

class App extends Component {
    constructor () {
        super();
        this.state = {
            filterText: "",
            list: [],
            inviteList: []
        }
    }

    componentWillMount () {
        let newList = [];
        let ele = "";
        for (ele in this.props.data) {
            this.props.data[ele].canInvited = true;
            newList.push(this.props.data[ele]);
        }
        this.setState({
            list: newList
        });
    }
    onFilterText (text) {   
        this.setState({
            filterText: text
        })
    }
    onTouchHandle (id) {
        let list = this.state.list;
        let orderList = [...this.state.inviteList];
        for (let i = list.length; i--;) {
            if (list[i].id == id) {
                list[i].canInvited = !list[i].canInvited;
                if (!list[i].canInvited) {
                    orderList.unshift(list[i]);
                } 
                break;
            }
        };
        orderList = orderList.filter((ele, index) => {
            return !ele.canInvited;
        }) 
        this.setState({
            inviteList:orderList
        })

    }
    render () {
        return (
            <div className="wrapper">
                <SearchBar inviteList={this.state.inviteList} onFilterText={this.onFilterText.bind(this)}></SearchBar>
                <InviteList filterText={this.state.filterText} data={this.state.list} onTouchHandle={this.onTouchHandle.bind(this)}></InviteList>
            </div>
        )
    }
}
 Ajax('GET', "./src/data/data.txt", true, "",(data) => {
    let myData = JSON.parse(data);   
    ReactDom.render(
        <App data={myData}></App>,
        document.getElementById('root')
    );
 });