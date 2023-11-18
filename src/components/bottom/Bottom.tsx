import { APIContext } from '../../core/api';
import { Titles } from '../../core/types';
import classes from './Bottom.module.css';
import { useState, useContext, useEffect } from 'react';

type Blocked = Titles & {
    blocked?: boolean;
}
interface IBottom {
    setBlocked: (b: boolean) => void;
}
export default function Bottom({ setBlocked }: IBottom) {
    const { data: { titles: t, answer }, settings: { rus: isRus }, checkAnswer, current_hint, addHistory } = useContext(APIContext);
    let titles = t;
    if (!titles.length) {
        titles = Array.from({ length: 4 }).map(() => ({ name: '', id: 0, russian: '' }))
    }
    useEffect(() => {
        setSelectedButton(null);
        setBlocked(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [answer]);
    const [selectedButton, setSelectedButton] = useState<number | null>(null);
    const handleButtonClick = (buttonNumber: number) => {
        setBlocked(true)
        setSelectedButton(buttonNumber);
        const _corr = titles.filter(e => e.id == answer)[0];
        const _sel = titles.filter(e => e.id === buttonNumber)[0];
        addHistory!(_corr.id === _sel.id ? [_corr] : [_sel, _corr]);
        return checkAnswer!(buttonNumber === answer);
    };
    if (answer && current_hint === 'fifty') {
        const filtered = (titles as Blocked[]).filter(e => e.id !== answer);
        const shuffle = filtered.sort(() => Math.random() - 0.5);
        const sliced = shuffle.slice(0, 2);
        sliced.forEach(e => e.blocked = true);
    }
    return (
        <div className='bottom'>
            {(titles as Blocked[]).map((item, i) => (
                <ButtonTitle
                    text={!isRus ? item.name : item.russian ? item.russian : item.name}
                    key={i}
                    onClick={() => handleButtonClick(item.id)}
                    id={item.id}
                    correct_id={answer}
                    selected={selectedButton}
                    blocked={item.blocked ? true : false}
                />
            ))}
        </div>
    );
}
interface IButtonTitle {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    correct_id: number;
    id: number;
    text: string;
    selected: number | null;
    blocked?: boolean
}
function ButtonTitle({ onClick, id, selected, correct_id, text, blocked }: IButtonTitle) {
    let className = classes.button;

    if (!text) {
        className += ' ' + classes.wait;
    }
    if (blocked) {
        className += ' ' + classes.blocked;
    }
    if (selected) {
        className += ' ' + classes.blocked;
        if (correct_id === id) {
            className += " " + classes.correct;
        } else if (selected == id) {
            className += " " + classes.wrong;
        }

    }
    return <button
        className={className}
        title={text}
        onClick={onClick}
    >{text}</button>
}
