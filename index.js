const flatten = (a) => {
    let r = [];
    a.forEach(i => {
        if (i instanceof Array) {
            r = r.concat(flatten(i));
        } else {
            r.push(i);
        }
    });
    return r;
};
const first = (a) => a && a.length ? a[0] : null;
const nodeListToArray = (nl) => {
    const a = [];
    for (let i = 0; i < nl.length; i++) {
        a.push(nl[i]);
    }
    return a;
};
const toIterable = function* (a) {
    let index = 0;
    while (a.length > index) yield a[index++];
};
const oneline = (s, ...args) => {
    const iter = toIterable(args);
    return s.map(v => v.split('\n').concat(iter.next().value).map(v => `${v || ''}`.trim()).join('')).join('').trim();
};
const tail = a => a.filter((v, i) => i > 0);
const genId = () => `ID_${parseInt(Math.random()*9999999)}`;
const keyValues = (obj) => {
    const result = [];
    for (let k in obj) {
        result.push([k, obj[k]]);
    }
    return result;
}
const values = (obj) => {
    const result = [];
    for (let k in obj) {
        result.push(obj[k]);
    }
    return result;
}
const safeToString = (x) => {
    switch (typeof x) {
        case 'object':
            return 'object';
        case 'function':
            return 'function';
        case 'string':
            return x;
        default:
            return x + '';
    }
}
const getQueryParams = () => {
    var m = {};
    var pairs = (location.search || "").substring(1).split("&");
    for (var i = 0; i < pairs.length; i++) {
        var kv = pairs[i].split('=');
        if (kv.length == 2) {
            m[kv[0]] = kv[1];
        }
    }
    return m;
}
const createBuilder = (...fields) => new function(){
    fields.forEach(field => this[`with${field[0].toUpperCase()}${field.substring(1)}`] = (value) => {
        this[field] = value;
        return this;
    });
    this.onBuild = (fn) => {
        this._onBuild = fn;
        return this;
    }
    this.build = () => this._onBuild(this);
}
const outdent = (s, ...val) => {
    let currVal = 0;
    let qtdSpaces = 0;
    let foundFirst = false;
    return s.map(v => v + (currVal < val.length ? val[currVal++] : '')).join('').split('\n')
        .map(line => {
            let result = line;
            if (!foundFirst) {
                if (line.trim()) {
                    foundFirst = true;
                    while (line[qtdSpaces] == ' ') qtdSpaces++;
                } else {
                    return '';
                }
            }
            let countSpaces = qtdSpaces;
            while (result.startsWith(' ') && countSpaces > 0) {
                countSpaces--;
                result = result.substring(1);
            }
            return result;
        }).join('\n').trim();
}
const toPromise = (p1, p2) => new Promise((resolve, reject) => {
    if (typeof p1 == "function") {
        const fn = p1;
        const parameters = p2 instanceof Array ? p2 : [p2];
        parameters.push((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
        fn(...parameters);
    } else {
        resolve(p1);
    }
});
module.exports = {
    flatten: flatten,
    nodeListToArray: nodeListToArray,
    toIterable: toIterable,
    oneline: oneline,
    first: first,
    tail: tail,
    generateId: genId,
    keyValues: keyValues,
    values: values,
    safeToString: safeToString,
    getQueryParams: getQueryParams,
    outdent: outdent,
    toPromise,
    getWindow: () => {
        let _temp = window;
        if (!_temp) {
            _temp = global;
            global.location = {
                pathname: "",
                search: ""
            };
        }
        return _temp;
    },
    createBuilder: createBuilder
};