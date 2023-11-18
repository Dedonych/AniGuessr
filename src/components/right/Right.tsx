import InfoLogo from '../../assets/info';
import SkipLogo from '../../assets/skip';
import { APIContext } from '../../core/api';
import classes from './Right.module.css'
import { useContext, useState } from 'react'
export default function Right({ blocked }: { blocked: boolean }) {
    const { hints, toggleHint,
        player: { currentScore },
        data: { info, info_russian,answer },
        settings: { rus } } = useContext(APIContext);
        const [hasInfo,setHasInfo] = useState(false);
        const handleInfo = ()=>{
            toggleHint!("info");
            setHasInfo(true);
            setTimeout(()=>{setHasInfo(false)},5000);
        }
    return <div className={classes.right}>
        <div className={classes.score}><span>Your score</span>
            <span>{currentScore}</span>
        </div>
        <div className={classes.hints + `${blocked||answer==0 ? ` ${classes.wait}` : ''}`}>
            <button
                className={hints.fifty !== 0 ? classes.blocked : ''}
                onClick={() => toggleHint!("fifty")}
                data-item={hints.fifty}
            ><b>50/50</b></button>
            <button
                className={hints.info !== 0 ? classes.blocked : ''}
                onClick={handleInfo}
                data-item={hints.info}
            ><InfoLogo /></button>
            <button
                className={hints.skip !== 0 ? classes.blocked : ''}
                onClick={() => {toggleHint!("skip")}}
                data-item={hints.skip}
            ><SkipLogo /></button>
        </div>
        { hasInfo&&<div className={classes.info}>
            <div>
                {rus&& info_russian?info_russian:info}
            </div>
        </div>}
    </div>
}
