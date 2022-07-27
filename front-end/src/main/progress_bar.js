import React, {forwardRef} from "react";


function ProgressBar(props, ref) {

    return (
        <div id="progressBar" ref={ref}></div>
    )
}

export default forwardRef(ProgressBar);
