import { APIContext } from '../../core/api'
import Link from '../link/Link';
import classes from './Left.module.css';
import { useContext, useState } from 'react'

export default function Left() {
    const { player: { maxScore }, prev, history, settings: { rus } } = useContext(APIContext);
    const url = `https://shikimori.one/animes/`;
    const [open, isOpen] = useState(false);
    const handleClick = () => {
        return isOpen(!open);
    }
    return <div className={classes.left}>
        <div>
            <span>Max Score</span>
            <span>{maxScore}</span>
        </div>
        <div className={classes.bottom}>
            <button className={`${classes.button}${!history!.length ? ' ' + classes.blocked : ''}`}
                onClick={handleClick}
            >History</button>
            <Link
                className={classes.button}
                {...prev ? { href: url + prev, target: "_blank" } : null} >Prev anime</Link>
        </div>
        {open && <nav className={`${classes.history}${open ? ' ' + classes.open : ''}`}>
            <button className={classes.close}
                onClick={handleClick}
            >X</button>
            <ul>
                {history?.length && history.map((e, i) =>
                    <li key={i}>
                        <p>{i + 1}</p>
                        <ul>
                            {
                                e.map((el, ind) => {
                                    if (el.length === 1)
                                        return <li key={`${i}-${ind}`}>{ind+1}
                                            <Link href={url + el[0].id} style={{ backgroundColor: "var(--correct-clr)" }}>{rus ? el[0].russian : el[0].name}</Link>
                                        </li>
                                    return <li key={`${i}-${ind}`}>
                                        <Link href={url + el[0].id} style={{ backgroundColor: "var(--wrong-clr)" }}>{rus ? el[0].russian : el[0].name}</Link>
                                        <Link href={url + el[1].id} style={{ backgroundColor: "var(--correct-clr)" }}>{rus ? el[1].russian : el[1].name}</Link>
                                    </li>;
                                })
                            }
                        </ul>
                    </li>)}
            </ul>
        </nav>}
    </div>
}
