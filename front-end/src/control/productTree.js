import AdminNav from "./adminNav";
import './css/productTree.css';
import {GetCookie, currentDOMAIN} from "../essentials";
import {useEffect, useRef, useState, useContext} from "react";
import {FaArrowAltCircleLeft} from 'react-icons/fa';
import {FcDeleteDatabase} from 'react-icons/fc';
import deleteProductTree from './deleteProductTree';
import {FetchByPrimaryKey as getObjByPK, SearchProductTree as product_search} from './fetch_by_primary_key'
import AuthContext from "../context/AuthContext";

let userSelectedPath = [];
let delTemp = [];
export default function ProductTree() {
    let {token} = useContext(AuthContext);
    const inputValue = useRef(null);
    const [way, GateWay] = useState(false);
    const searchProductPath = useRef(null);

    const create = () => {
        let value = inputValue.current.value;
        const request = new Request(currentDOMAIN() + '/func_control_panel/saveProductTree/', {
            headers: {'X-CSRFToken': GetCookie("csrftoken"), 'Content-Type': 'application/json',     'Authorization': 'Bearer ' + String(token.access)}
        });

        fetch(request, {
            method: 'post', body: JSON.stringify({
                name: value, pk: userSelectedPath[userSelectedPath.length - 1]
            })
        }).then(rsp => rsp.json()).then(function (response) {
            inputValue.current.value = '';
            if (response.length === undefined) {
                loadParentObjects();
            } else {
                setRsp(true);
                setObj(response);
            }
        })
    }

    const [rsp, setRsp] = useState(false);
    const [obj, setObj] = useState(null);

    const loadParentObjects = () => {
        fetch(currentDOMAIN() + '/func_control_panel/ProductTreeBase', {
            headers: {
                'Content-Type': 'application/json', 'Authorization': 'Bearer ' + String(token.access)
            }
        }).then(rsp => rsp.json()).then(function (rsp) {
            setRsp(true);
            setObj(rsp);
        });
    }
    useEffect(() => {
        loadParentObjects();
        document.addEventListener('keydown', makeSearchQuery);
    }, []);

    const makeSearchQuery = (ev) => {
        if (ev.keyCode === 13) {
            let query = searchProductPath.current.value;
            if (query.length > 0) {
                let primaryKey;
                if (userSelectedPath.length === 0) {
                    primaryKey = "parent";
                } else {
                    primaryKey = userSelectedPath[userSelectedPath.length - 1];
                }
                product_search(query, primaryKey, token.access).then(rsp => rsp).then(function (response) {
                    setRsp(true);
                    setObj(response);
                });
            }
        }
    }


    const fetchChild = (e) => {
        e.preventDefault();
        let primaryKey = e.currentTarget.id;
        userSelectedPath.push(parseInt(primaryKey));
        e.preventDefault();
        GateWay(true);
        FetchByPrimaryKey(primaryKey);
    }

    const FetchByPrimaryKey = (primaryKey) => {
        getObjByPK(primaryKey, token.access).then(rsp => rsp).then(function (rsp) {
            if (rsp.length === 0) {
                setRsp(false);
            } else {
                setRsp(true);
                setObj(rsp)
            }
        });
    }

    const renderData = (rsp) => {
        let temp = [];
        for (let i in rsp) {
            let name = rsp[i].product;
            let pk = rsp[i].id;
            let dynamicClass = pk + " delIcons"
            temp.push(<div key={i} className="trim">
                <p className="Content" style={{float: 'left'}}>{name}</p>
                <span onClick={(e) => {
                    fetchChild(e);
                }} id={pk} className="expandIcon">+</span>
                <span onClick={(e) => {
                    deleteValue(e);
                }} className={dynamicClass}><FcDeleteDatabase/></span>
                <br/> <br/>
            </div>)
        }
        return (<div>{temp.reverse()}</div>)
    }

    const [deleteDialog, setDialog] = useState(false);

    const DeleteDialog = (params) => {
        if (params.bool === true) {
            return (
                <div id="conformationDialog" className="p-3 mb-2 bg-dark text-white">
                    <center>
                        Are you sure you want to delete this? <br/>
                        <button onClick={conformDelete} className="btn btn-danger">delete</button>
                        <button style={{marginLeft: '1%'}} onClick={cancelDelete} className="btn btn-primary">cancel
                        </button>
                    </center>
                </div>
            )
        }
    }
    const cancelDelete = () => {
        setDialog(false);
    }

    const conformDelete = () => {
        let pk = delTemp[0].dom;
        pk = parseInt(pk.className.split(' ')[0]);
        deleteProductTree(pk, token.access);
        delTemp = [];
        setDialog(false);
        if (userSelectedPath.length === 0) {
            setTimeout(function () {
                loadParentObjects();
            }, 500);
            return 0;
        }
        currentStack();
    }

    function currentStack() {
        let currentIndex = userSelectedPath[userSelectedPath.length - 1];
        setTimeout(function () {
            FetchByPrimaryKey(currentIndex);
        }, 500);
    }


    const deleteValue = (e) => {
        delTemp.push(
            {
                'dom': e.currentTarget
            }
        );
        setDialog(true);
    }

    const Data = (params) => {
        if (params.bool === true) {
            let rsp = params.data;
            return (renderData(rsp));
        }
    }

    const Path = (params) => {
        if (params.cd === true) {
            return (
                <div id="goBack" onClick={() => {
                    backButtonClick()
                }}
                ><FaArrowAltCircleLeft/></div>
            )
        }
    }

    const renderCurrentState = () => {
        let backLength = userSelectedPath.length - 1;
        let requiredKey = userSelectedPath[backLength];

        if (requiredKey !== undefined) {
            FetchByPrimaryKey(requiredKey);
        } else {
            GateWay(false);
            loadParentObjects();
        }
    }

    const backButtonClick = () => {
        if (userSelectedPath.length > 0) {
            userSelectedPath.pop();
        }
        renderCurrentState();
    }

    const setCurrentStack = () => {
        if (searchProductPath.current.value.length === 0) {
            if (userSelectedPath.length > 0) {
                currentStack();
            } else {
                loadParentObjects();
            }
        }
    }

    return (<div>
        <AdminNav/>
        <br/>
        <center>
            <div id="productTreeForm" className="shadow p-3 mb-5 bg-white rounded">
                <h4>Set product branch</h4> <br/>
                <center><DeleteDialog bool={deleteDialog}/></center>
                <input ref={inputValue} placeholder="create"
                       id="createModileInput" className="form-control"/>
                <button id="addButton" onClick={create} className="btn btn-primary">Add</button>
                <input onChange={setCurrentStack} ref={searchProductPath} type="text" id="searchProductPath"
                       placeholder="search"
                       className="form-control"/>
                <br/> <br/>
                <Path cd={way}/>
                <hr/>
                <Data bool={rsp} data={obj}/>
            </div>
        </center>
    </div>)
}