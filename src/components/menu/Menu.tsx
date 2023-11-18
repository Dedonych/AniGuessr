import { APIContext } from '../../core/api';
import classes from './Menu.module.css';
import { useState, useContext } from 'react';
export default function Menu() {
    const { settings, updateSetting } = useContext(APIContext)
    const handleChangeCheckbox = (value: boolean | number | 'only', name: string) => {
        updateSetting!(name,value);
    }
    const [value, setValue] = useState(settings.minScore);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => setValue(+e.target.value);
    return <div className="menu">
        <label className={classes.theme}>
            <input type="checkbox"
                id='theme'
                checked={settings.theme}
                onChange={(e) => handleChangeCheckbox(e.target.checked, "theme")}
            />
        </label>
        <label title='Enable Russian names of titles'>
            <p>is Rus:</p>
            <input type="checkbox"
                checked={settings.rus}
                onChange={(e) => handleChangeCheckbox(e.target.checked, "rus")}
            />
        </label>
        <label title='Minimal rating on MAL'>
            <p>Min score:</p>
            <input type="number"
                max={10}
                min={0}
                step={1}
                value={value}
                onBlur={(e) => handleChangeCheckbox(+e.target.value, "minScore")}
                onInput={handleInput}
            />
        </label>
        <label title='Use MAL link instead Shikimori'>
            <p>MAL links</p>
            <input type="checkbox"
                name='isMAL'
                checked={settings.isMAL}
                onChange={(e) => handleChangeCheckbox(e.target.checked, "isMAL")}
                />
        </label>
        <p>Censored</p>
        <label title='Exclude NSFW animes'>
            <input type="radio"
                name='nsfw'
                checked={settings.nsfw == true}
                value={`${settings.nsfw == true}`}
                onChange={() => handleChangeCheckbox(true, "nsfw")}
                />
                <p>Disabled</p>
        </label>
        <label title='Include NSFW animes'>
            <input type="radio"
                name='nsfw'
                checked={settings.nsfw == false}
                value={`${settings.nsfw == false}`}
                onChange={() => handleChangeCheckbox(false, "nsfw")}
                />
                <p>Enabled</p>
        </label>
        <label title='Use only Rx animes'>
            <input type="radio"
                name='nsfw'
                checked={settings.nsfw == 'only'}
                value={`${settings.nsfw == 'only'}`}
                onChange={() => handleChangeCheckbox('only', "nsfw")}
                />
                <p>Only</p>
        </label>
    </div>
}
