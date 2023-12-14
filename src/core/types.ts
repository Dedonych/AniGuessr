export interface IAPI {
	settings: Settings;
	player: Player;
	data: Data;
    hints:Hints;
    
}

export interface Settings {
    [key:string]:boolean|number|'only';
	rus: boolean;
	minScore: number;
	nsfw: boolean|'only';
	theme: boolean;
    isMAL:boolean;
}

export interface Player {
	maxScore: number;
	currentScore: number;
}
export interface Hints{
    [key:string]:number;
    fifty:number;
    info:number;
    skip:number;
}
export interface Data {
	answer: number;
	titles: Titles[];
	info: string;
	info_russian: string;
    image:string;
}

export interface Titles {
	name: string;
	russian: string;
	id: number;
}
export interface APIFunction extends IAPI{
    excludes_ids?:number[];
    status?:'win'|'lose'|null;
    history?:Titles[][][];
    current_hint?:'fifty' | 'info' | 'skip'|null;
    prev?:number|null;
    updateSetting?(key: string, value: boolean|number|'only'):void;
    checkAnswer?(is:boolean):void;
    toggleHint?(name:'fifty' | 'info' | 'skip'):void;
    restartGame?():void;
    addHistory?(t:Titles[]):void;
    hintsCount?:number[];
}
export interface IResponse {
    id: number;
    name: string;
    russian: string;
    image?: {
      original: string;
    };
    description?:string|null;
    data:{
      synopsis?:string;
    }
  }