import {GetCookie, currentDOMAIN} from "../essentials";

export default function deleteProductTree(pk, token) {
    const request = new Request(currentDOMAIN() + '/func_control_panel/DeleteProductTree/', {
        headers: {
            'X-CSRFToken': GetCookie("csrftoken"),
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(token)
        }
    });
    fetch(request, {
        method: 'post',
        body: JSON.stringify({
            primary_key: parseInt(pk)
        })
    }).then();
}