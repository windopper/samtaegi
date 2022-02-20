

    export default function secToHMS(sec) {
        let h;
        let m;
        let s;
        h = String(Math.floor(sec / 3600));
        if (h.length == 1) h = "0" + h;
        sec = sec % 3600;
        m = String(Math.floor(sec / 60));
        if (m.length == 1) m = "0" + m;
        sec = sec % 60;
        s = String(sec);
        if (s.length == 1) s = "0" + s;
        if (h == 0) {
          return m + ":" + s;
        }
        return h + ":" + m + ":" + s;
    }