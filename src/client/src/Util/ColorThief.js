import ColorThief from 'colorthief'

export function getColors(img) {
    const ct = new ColorThief()
    return ct.getPalette(img, 3, 10)
}