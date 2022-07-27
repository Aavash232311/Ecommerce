import {currentDOMAIN} from "../essentials";

async function FetchByPrimaryKey(primaryKey, token) {

    return await fetch(currentDOMAIN() + '/func_control_panel/ChildrenModel/' + primaryKey + '/', {
        headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + String(token)
        }
    }).then(rsp => rsp.json()).then(function (rsp) {
        return rsp;
    });
}

async function BasicParentObjects(token) {
    return await fetch(currentDOMAIN() + '/func_control_panel/ProductTreeBase', {
        headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + String(token)
        }
    }).then(rsp => rsp.json()).then(function (rsp) {
        return rsp;
    })
}

async function SearchProductTree(query, primary_key, token) {
    return await fetch(currentDOMAIN() + '/func_control_panel/SearchQuery/' + query + '/' + primary_key + '/', {
        headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + String(token)
        }
    }).then(rsp => rsp.json()).then(function (response) {
        return response;
    });
}

export {FetchByPrimaryKey, BasicParentObjects, SearchProductTree};