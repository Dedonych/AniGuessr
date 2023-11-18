import { useContext } from 'react'
import classes from './Status.module.css'
import { APIContext } from '../../core/api'

export default function Status(){
    const {status,restartGame} = useContext(APIContext);
    if(status===null)return<></>;
    return <div className={classes.status}>
        <p>You {status}!</p>
        <button
        onClick={()=>restartGame!()}
        >Restart</button>
    </div>
}