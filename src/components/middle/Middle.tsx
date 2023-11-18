import {useState,useContext} from 'react';
import { APIContext } from '../../core/api';

export default function Middle() {
    const {data:{image}} = useContext(APIContext)
    const [size,setSize] = useState ("");
    const handleClick = ()=>setSize(size?"":" size")
    return <div className={`middle${size}`} onClick={handleClick}>
        {image!==''?<img loading="lazy" src={image}/>:<img/>}
    </div>
}