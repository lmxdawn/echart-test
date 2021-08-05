const API_URL = 'http://kline.t42.jjhpool.com:10040'
function queryParams(data, isPrefix = false) {
    let prefix = isPrefix ? '?' : '';
    let _result = [];
    for (let key in data) {
        let value = data[key];
        // 去掉为空的参数
        if (['', undefined, null].includes(value)) {
            continue
        }
        if (value.constructor === Array) {
            value.forEach(_value => {
                _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
            })
        } else {
            _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
        }
    }

    return _result.length ? prefix + _result.join('&') : ''
}

const request = (obj) => {

    obj.url = API_URL + obj.url;

    obj.params = obj.params || {};
    if (obj.params) {
        obj.url = obj.url + queryParams(obj.params, true);
    }
    return new Promise((resolve, reject) => {
        uni.request({
            url: obj.url,
            method: obj.method || "get",
            data: obj.data,
            dataType: 'json',
            header: obj.header
        }).then(data => {
            let [err, res] = data;
            let resData = res.data || {};
            console.log("总请求", res);
            if (res.statusCode !== 200) {
                reject(err);
            } else {
                resolve(resData);
            }
        }).catch(err => {
            return reject(err);
        });
    });
};

export default request
