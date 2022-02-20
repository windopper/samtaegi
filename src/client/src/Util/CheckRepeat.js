

export default function CheckRepeat(queue, song) {
    if(queue && !song) return 'QUEUE'
    else if(song && !queue) return 'SONG'
    else return 'NONE'
}