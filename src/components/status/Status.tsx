import { useContext } from 'react'
import classes from './Status.module.css'
import { APIContext } from '../../core/api'

export default function Status() {
    const { status, restartGame, hintsCount } = useContext(APIContext);
    if (status === null) return <></>;
    return <div className={classes.status}>
        <div className={classes.top}><p>You {status}!</p>
        <div className={classes.hints}>{['fifty', "info", "skip"].map((e, i) => <p key={i}>{e}: {hintsCount![i]}</p>)}</div>
        </div>
        <button onClick={restartGame}>Restart</button>
    </div>
}