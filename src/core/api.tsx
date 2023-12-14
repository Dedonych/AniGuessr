import { createContext, useState, useEffect } from "react";
import { APIFunction, IAPI, Titles, IResponse, Data } from "./types";

const nullData: IAPI = {
    settings: {
        rus: false,
        minScore: 5,
        nsfw: false,
        theme: true,
        isMAL: false
    },
    player: {
        maxScore: 0,
        currentScore: 0,
    },
    data: {
        answer: 0,
        titles: [],
        info: '',
        info_russian: '',
        image: '',
    },
    hints: {
        fifty: 5,
        info: 10,
        skip: 15
    },
};
import.meta.env.DEV && (nullData.hints = {
    fifty: 1,
    info: 2,
    skip: 3
})

type StorageType = [boolean, number, boolean, boolean, boolean, number];
const getStorage = () => {
    const d = localStorage.getItem('settings');
    if (!d) return nullData;
    const parsedData = JSON.parse(d) as StorageType;
    if (!Array.isArray((parsedData))) {
        localStorage.clear();
        return nullData;
    }
    return {
        ...nullData,
        settings: {
            rus: parsedData[0],
            minScore: parsedData[1],
            nsfw: parsedData[2],
            theme: parsedData[3],
            isMAL: parsedData[4],
        },
        player: {
            currentScore: 0,
            maxScore: parsedData[5],
        },
    };
}
const APIContext = createContext<APIFunction>(nullData);
function APIProvider({ children }: { children: React.ReactNode }) {
    const storage = getStorage();
    const [settings, setSettings] = useState(storage.settings);
    const [player, setPlayer] = useState(storage.player);
    const [data, setData] = useState(storage.data);
    const [hints, setHints] = useState(storage.hints);
    const [excludes_ids, setExcludesIds] = useState<number[]>([]);
    const [round, setRound] = useState(0);
    const addRound = () => setRound(p => p + 1);

    const [history, setHistory] = useState<Titles[][][]>([]);
    const addHistory = (t: Titles[]) => setHistory(prev => [...prev.slice(0, round), [...(prev[round] || []), t], ...prev.slice(round + 1)]);
    //   f,i,s
    const [hintsCount, SetHintsCount] = useState<[number, number, number]>([0, 0, 0]);
    enum HintsEnum {
        fifty,
        info,
        skip,
    }
    const handleSetHintsCount = (key: keyof typeof HintsEnum) => SetHintsCount((p) => {
        p[HintsEnum[key]]++;
        return p;
    });
    const [status, setStatus] = useState<'win' | 'lose' | null>(null);
    const handleChangeStatus = (s: 'win' | 'lose' | null) => setStatus(s);

    const [current_hint, setCurrentHint] = useState<'fifty' | 'info' | 'skip' | null>(null);
    const handleSetCurrentHint = (h: 'fifty' | 'info' | 'skip' | null) => setCurrentHint(h);

    const [prev, setPrev] = useState<number | null>(null);

    const setStorage = () => localStorage.setItem('settings', JSON.stringify([...Object.values(settings), player.maxScore]));
    const updateSetting = (key: string, value: boolean | number | 'only') => setSettings(prev => ({ ...prev, [key]: value }));
    const incScore = (_c = player.currentScore + 1, _m = player.maxScore < _c ? _c : player.maxScore) => setPlayer({ maxScore: _m, currentScore: _c });
    const addExcludesIds = (_ids: number | number[] = data.titles.map(({ id }) => id)) => setExcludesIds(p => ([...new Set([...p, ...(typeof _ids === 'number' ? [_ids] : _ids)])]));
    const decHints = ([fifty, info, skip] = Object.keys(hints).map(e => hints[e] == 0 ? 0 : hints[e] - 1)) => setHints({ fifty, info, skip, });
    const resetData = () => setData(nullData.data);
    const resetAll = () => (handleSetCurrentHint(null), handleChangeStatus(null), resetData(), setHints(nullData.hints), setExcludesIds([]), incScore(0));
    const checkAnswer = (is: boolean) => (setPrev(data.answer), is ? (decHints(), incScore(), setCurrentHint(null), addExcludesIds()) : handleChangeStatus('lose'));
    const restartGame = () => (SetHintsCount([0, 0, 0]), addRound(), resetAll())
    const toggleHint = (name: 'fifty' | 'info' | 'skip') => (handleSetHintsCount(name), setHints(p => ({ ...p, [name]: nullData.hints[name] })), setCurrentHint(name), name === 'skip' && next());
    async function getData() {
        const shiki_url = "https://shikimori.one/api/animes",
            one_url = shiki_url + "?order=random",
            four_url = one_url + '&limit=4',
            jikan_url = "https://api.jikan.moe/v4/anime"
        const missing_image = "/assets/globals/missing_original.jpg";
        const _fetch = async (url: string, id?: number, retries = 3, link = id ? `${url}/${id}` : url): Promise<void | IResponse | IResponse[]> => {
            try {
                const response = await fetch(link);
                if (response.ok) {
                    const data = await response.json();
                    if (url == one_url && data[0].image.original == missing_image) _fetch(url);
                    return await data;
                }
            } catch (error) {
                if (retries > 0) {

                    return await _fetch(url, id, retries - 1)
                }
                else return console.error(error);
            }
        }
        const setSettingsToURL = ({ minScore: min, nsfw } = settings) =>
            `${min == 0 ? '' : `&score${min}`}&${nsfw === 'only' ? 'rating=rx' : `censored${nsfw}`}${excludes_ids.length ? '&exclude_ids=' + excludes_ids.join() : ''}`
        const removeBBcode = (text: string) => text.split(/[\u002e\n\u0021]/)[0].replace(/\[.*?\]/g, "").trim() + ".";
        const filter = setSettingsToURL();
        const link = four_url + filter;
        const _data = await _fetch(link) as IResponse[];

        if (_data.length < 4) return handleChangeStatus('win');

        const rand = Math.floor(Math.random() * 4)
        let correct = _data[rand];
        if (correct.image?.original.includes(missing_image)) {
            addExcludesIds(correct.id);
            correct = await _fetch(one_url + setSettingsToURL()) as IResponse;
        }
        correct = await _fetch(shiki_url, correct.id) as IResponse;
        _data[rand] = correct;

        const eng = await _fetch(jikan_url, correct.id) as IResponse;
        let desc_eng = '';
        if (eng.data && eng.data.synopsis) {
            desc_eng = removeBBcode(eng.data.synopsis);
        }
        const _titles: Titles[] = _data.map(e => ({ name: e.name, russian: e.russian, id: e.id }));
        return {
            answer: correct.id,
            info_russian: correct.description ? removeBBcode(correct.description) : null,
            info: desc_eng,
            titles: _titles,
            image: "https://shikimori.one" + correct.image?.original
        } as Data;
    }
    const next = async () => {
        try {
            handleChangeStatus(null);
            resetData();
            const result = await getData();
            if (!result) return;
            setData(result);
        }
        catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        setStorage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings, player])
    useEffect(() => {
        setTimeout(() => {
            return next();
        }, 1500)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [excludes_ids])

    return <APIContext.Provider value={{
        settings,
        data,
        player,
        hints,
        checkAnswer,
        updateSetting,
        toggleHint,
        restartGame,
        status,
        history,
        current_hint,
        prev,
        addHistory,
        hintsCount
    }}>{children}</APIContext.Provider>
}


export { APIContext, APIProvider };