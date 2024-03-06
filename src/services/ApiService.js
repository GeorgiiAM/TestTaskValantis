import {
    API_ADDRESS_ARRAY,
    PASSWORD,
    ITEMS_PER_PAGE,
    RETRY_COUNT
} from '../../config';
import axios from 'axios';
import md5 from 'md5';


function generateAuthString() {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return md5(`${PASSWORD}_${timestamp}`);
}

async function sendRequest(action, params, retryCount = RETRY_COUNT) {
    const authString = generateAuthString();

    try {
        const response = await axios.post(API_ADDRESS_ARRAY[0], {
            action,
            params
        }, {
            headers: {
                'X-Auth': authString
            }
        });
        console.log('response = ', response);

        return response.data;
    } catch (error) {

        console.error('error = ', error);

        if (retryCount > 0) {
            console.log('Retrying request...');
            return sendRequest(action, params, retryCount - 1);
        } else {
            console.error('Max retry attempts reached. Unable to complete request.');
            return null;
        }
    }
}

function intersection(arrays) {
    return arrays.reduce((acc, current) => acc.filter(element => current.includes(element)));
}

export async function getList(offset, limit, filters = {}) {

    let ids = [];
    let filterResult = [];

    if (Object.keys(filters).length > 0) {
        for (const [key, value] of Object.entries(filters)) {

            if (!value) {
                delete filters[key];
                continue;
            }

            const data = await sendRequest('filter', {
                [key]: value
            });

            if (data) {
                filterResult.push(data.result)
            }
        }

        if (filterResult.length > 0) {
            ids = intersection(filterResult);
        }
    }

    if (ids.length > ITEMS_PER_PAGE) {
        ids = ids.slice(0, ITEMS_PER_PAGE + 1);
    }

    if (Object.keys(filters).length == 0) {
        const data = await sendRequest('get_ids', {
            "offset": offset,
            "limit": limit
        });
        if (data) {
            ids = ids.concat(data.result);
        }
    }

    let list = [];

    if (ids.length > 0) {
        const data = await sendRequest('get_items', {
            "ids": ids
        });
        if (data) {
            list = data.result;
        }
    }

    list = removeDuplicatesById(list);

    return list;
}

function removeDuplicatesById(arr) {
    const uniqueIds = new Set();
    const uniqueArr = [];

    arr.forEach(obj => {
        if (!uniqueIds.has(obj.id)) {
            uniqueIds.add(obj.id);
            uniqueArr.push(obj);
        }
    });

    return uniqueArr;
}