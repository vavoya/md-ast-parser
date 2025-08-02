import {ImgInline} from "./types";


export default function createImgInline(alt: string, src: string): ImgInline {
    return {
        type: 'img',
        alt,
        src,
    }
}