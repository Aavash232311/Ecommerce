import SellerNav from "./SellerNav";
import {useState, useEffect, useRef, useContext} from "react";
import {BsArrowRightShort, BsFillArrowLeftCircleFill, BsWater} from 'react-icons/bs';
import {FetchByPrimaryKey, BasicParentObjects, SearchProductTree} from '../control/fetch_by_primary_key';
import {CKEditor} from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import {FcImageFile, FcChargeBattery} from 'react-icons/fc';
import {AiOutlineDelete} from 'react-icons/ai';
import TextField from '@mui/material/TextField';
import {Button, InputAdornment, Switch} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import {AiFillFire} from 'react-icons/ai';
import {GiGroundbreaker} from 'react-icons/gi';
import AuthContext from "../context/AuthContext";

let pathArray = [];
let tagArray = [];
const currencies = [
    {
        value: 'Liquid',
        label: <div><BsWater/> Water</div>,
    },
    {
        value: 'flammable',
        label: <div><AiFillFire/> Flammable</div>,
    },
    {
        value: "battery",
        label: <div><FcChargeBattery/>Battery</div>,
    },
    {
        value: 'sensitive',
        label: <div><GiGroundbreaker/>Sensitive</div>,
    },
];
export default function AddProduct() {
    const [parentRsp, setParentRsp] = useState(false);
    const [base, setBase] = useState([]);
    const [path, setPath] = useState(false);
    let {token} = useContext(AuthContext);

    const get_by_primary_key = (e, pk) => {
        let id;
        if (e === null) {
            id = pk;
        } else {
            id = parseInt(e.currentTarget.parentNode.id);
        }
        FetchByPrimaryKey(id, token.access).then(rsp => rsp).then(function (rsp) {
            if (rsp.length > 0) {
                if (e !== null) {
                    pathArray.push(
                        parseInt(id)
                    );
                    setPath(true);
                }
                setParentRsp(true);
                let objects = basicTemplateBoxElem(rsp);
                setBase(objects);
            }
        });
    }

    function basicTemplateBoxElem(rsp) {
        let i;
        let parentRsp = [];
        for (i = 0; i < rsp.length; i++) {
            parentRsp.push(
                <div key={i} id={rsp[i].id} className="product_types_values">
                    <span style={{float: "left"}}>{rsp[i].product}</span>
                    <span onClick={(e) => {
                        get_by_primary_key(e);
                    }}
                          className="arrwoRight" style={{float: "right"}}><BsArrowRightShort/></span>
                </div>
            )
        }
        return parentRsp;
    }


    const loadParentObjects = () => {
        BasicParentObjects(token.access).then(rsp => rsp).then(async function (rsp) {
            setParentRsp(true);
            let objects = basicTemplateBoxElem(rsp);
            setBase(objects);
        });
    }

    const BaseElement = (params) => {
        if (params.bool === true) {
            return (
                <div id={base.toString()}>{base}</div>
            )
        }
    }
    useEffect(() => {
        loadParentObjects();
    }, []);


    const backClick = () => {
        searchValue.current.value = '';
        if (pathArray.length > 0) {
            pathArray.pop();
        }
        let lastObject = pathArray[pathArray.length - 1];
        if (lastObject === undefined) {
            loadParentObjects();
            setPath(false);
        } else {
            get_by_primary_key(null, lastObject);
        }
    }
    const show = {
        display: "block"
    }
    const hide = {
        display: "none"
    }

    const searchValue = useRef(null);

    const search = () => {
        let query = searchValue.current.value;
        let primary_key = pathArray[pathArray.length - 1];
        if (query.length === 0) {
            if (primary_key !== undefined) {
                get_by_primary_key(null, primary_key);
            } else {
                loadParentObjects();
            }
        } else {
            if (primary_key === undefined) {
                primary_key = 'parent';
            }
            SearchProductTree(query, primary_key, token.access).then(rsp => rsp).then(function (response) {
                setParentRsp(true);
                let objects = basicTemplateBoxElem(response);
                setBase(objects);
            });
        }
    }
    const [image, setImage] = useState(false);


    const previewSelected = (e) => {
        let parentNode = e.currentTarget.parentNode.parentNode.children;
        parentNode[0].style.display = 'none';
        let image = parentNode[1];
        image.src = URL.createObjectURL(parentNode[2].children[0].files[0]);
        image.style.display = 'block';
    }


    const ImagePlace = (params) => {
        if (params.bool === true) {
            const temp = [];
            let i;
            for (i = 0; i < 7; i++) {
                temp.push(
                    <div key={i} className="imageBlocksUI">
                        <label htmlFor={"img_" + i}>
                            <FcImageFile style={{fontSize: "38px", marginTop: "10px"}}/>
                            <img style={{display: "none"}} id={"prv_img_" + i} height="100%" width="100%" alt=""/>
                            <div style={{display: "none"}}>
                                <input onInput={(e) => {
                                    previewSelected(e);
                                }} id={"img_" + i} type="file" accept="image/*"/>
                            </div>
                        </label>
                    </div>
                )
            }
            return temp;
        }
    };

    useEffect(() => {
        setImage(true);
    }, []);

    const addTag = useRef(null);
    const [renderTags, setRenderTags] = useState(false);

    const addTags = () => {
        let tag = addTag.current.value;
        if (tagArray.length < 12 && tag.length > 0) {
            tagArray.push(tag);
        }
        syncTags();
        addTag.current.value = null;
    }

    function syncTags() {
        if (renderTags === false) {
            setRenderTags(true);
        } else {
            setRenderTags(false);
        }
    }

    const Tags = (params) => {
        let temp = [];
        for (let i = 0; i < tagArray.length; i++) {
            temp.push(
                <div className="tags">
                    <span>{tagArray[i]}</span>
                    <span style={{float: "right", marginRight: "5px"}}>
                    <AiOutlineDelete onClick={(e) => {
                        deleteTags(e);
                    }} className="deleteTags"/>
                </span>
                </div>
            )
        }
        return temp;
    }

    const deleteTags = (e) => {
        let nodes = e.currentTarget.parentNode.parentNode.children[0].innerText;
        const tempArray = [];
        for (let i = 0; i < tagArray.length; i++) {
            if (tagArray[i] === nodes) {
                tagArray[i] = null;
            } else {
                tempArray.push(tagArray[i]);
            }
        }
        tagArray = tempArray;
        syncTags();
    }

    const left = {
        float: "left",
        marginLeft: "5px"
    }
    const productName = useRef(null);
    const [currency, setCurrency] = useState('Liquid');

    const handleChange = (event) => {
        setCurrency(event.target.value);
    };

    const boxContent = useRef(null);
    const label = {inputProps: {'aria-label': 'Switch demo'}};

    return (
        <div style={{color: "#3F51B5"}} id="add_products">
            <SellerNav/> <br/>
            <center>
                <div className="addProductFrame">
                    <span><b>Add Product General Information</b></span> <br/>
                    <label htmlFor="add_product" className="form-label"><br/>
                        <TextField inputProps={{ref: productName}} className="maxLabel"
                                   id="add_product" label="product name" variant="standard"/>

                    </label>
                    <hr style={{visibility: "hidden", height: "50px"}}/>
                    <label className="form-label">
                        <span style={{float: "left"}}> product types</span>
                    </label>
                    <div style={{border: "1px solid #9E9E9E"}} id="product_types"
                         className="shadow p-3 mb-5 bg-white rounded form-label">
                        <TextField className="minLabel" inputProps={{ref: searchValue}} onInput={search} label="search"
                                   variant="standard"/>
                        <div id="backIcon" style={{float: "right"}}><BsFillArrowLeftCircleFill
                            style={path ? show : hide}
                            onClick={backClick}/>
                        </div>
                        <br/>
                        <br/> <br/>
                        <BaseElement bool={parentRsp}/>
                    </div>
                    <hr style={{visibility: "hidden", height: "275px"}}/>
                    <label className="form-label">
                        <span style={{float: "left"}}> product description</span>
                    </label> <br/>
                    <div className="form-label" id="rich_text_editor_div">
                        <CKEditor
                            editor={Editor}
                        />
                    </div>
                </div>
                <hr style={{visibility: "hidden"}}/>
                <div id="add_product_Frame" className="addProductFrame">
                    <label className="form-label">
                        <span style={{float: "left"}}> product images, first one is the main image</span>
                    </label> <br/>
                    <div id="imageBar" className="shadow p-3 mb-5 bg-white rounded form-label">
                        <ImagePlace bool={image}/>
                    </div>
                    <hr style={{visibility: "hidden"}}/>
                    <label className="form-label">
                        <span style={{float: "left"}}> product tags</span>
                    </label> <br/>
                    <div id="product_tags" className="form-label shadow p-3 mb-5 bg-white rounded">
                        <div>
                            <ul className="h-list">
                                <li className="h-list">
                                    <input type="text" id="product_tag_search" className="form-control" placeholder="search" ref={addTag}/>
                                </li>
                                <li className="h-list">
                                    <button id="add_tag_btn" onClick={addTags} className="btn btn-success">Add tags</button>
                                </li>
                            </ul>
                        </div>
                        <hr style={{visibility: "hidden", height: "30px"}}/>
                        <hr/>
                        <div id="render_tag_frames" style={{overflow: "auto", height: "100px"}}>
                            <Tags bool={renderTags}/>
                        </div>
                    </div>
                    <hr style={{visibility: "hidden"}}/>
                    <TextField className="maxLabel" inputProps={{ref: boxContent}} label="box content"
                               variant="standard"/>
                    <hr style={{height: "390px", visibility: "hidden"}}/>
                    <div className="form-check form-check-inline productFormRadios">
                        <label className="form-check-label" htmlFor="inlineCheckbox1">Delivery by seller</label>
                        <Switch {...label} id="delivery_by_seller" color="secondary"/>
                    </div>
                    <div className="form-check form-check-inline productFormRadios">
                        <label className="form-check-label" htmlFor="inlineCheckbox1">available</label>
                        <Switch {...label} id="available" color="secondary"/>
                    </div>
                    <div className="form-check form-check-inline productFormRadios">
                        <label className="form-check-label" htmlFor="inlineCheckbox1">cash on delivery</label>
                        <Switch {...label} id="cash_on_delivery" color="secondary"/>
                    </div>
                    <hr style={{visibility: "hidden"}}/>
                    <div className="form-inline form-label">
                        <div style={left}>
                            <TextField
                                label="Weight in kg"
                                id="outlined-start-adornment"
                                sx={{m: 1, width: '25ch'}}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                                }}
                            />
                            <br/>
                            <TextField
                                label="Height in cm"
                                id="outlined-start-adornment"
                                sx={{m: 1, width: '25ch'}}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                                }}
                            />
                            <br/>
                            <TextField
                                label="Width in cm"
                                id="outlined-start-adornment"
                                sx={{m: 1, width: '25ch'}}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                                }}
                            /> <br/>
                            <TextField
                                label="Length in cm"
                                id="outlined-start-adornment"
                                sx={{m: 1, width: '25ch'}}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">cm</InputAdornment>,
                                }}
                            /> <br/>
                            <TextField
                                label="price in Rs."
                                id="outlined-start-adornment"
                                sx={{m: 1, width: '25ch'}}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                }}
                            /> <br/>
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="product types"
                                value={currency}
                                onChange={handleChange}
                                sx={{m: 1, width: '25ch'}}
                                helperText="Product types"
                            >
                                {currencies.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField> <br/>
                            <hr style={{width: "80%"}}/>
                            <TextField
                                id="datetime-local"
                                label="Discount valid"
                                type="datetime-local"
                                defaultValue="2017-05-24T10:30"
                                sx={{width: 250}}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                        <hr style={{width: "80%", visibility: "hidden"}}/>
                        <div id="last_two">
                            <Button style={{width: "100%"}} id="submitButton"
                                    variant="contained">Submit</Button>
                        </div>
                    </div>
                </div>
            </center>
        </div>
    )
}