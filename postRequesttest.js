import http from 'k6/http';
import {check, sleep} from 'k6'
const url = 'https://reqres.in/api/users'; //free api example
export const options = {
    vus: 1,
    iterations: 2,
};

export default function(){
    const data = JSON.stringify({
        name: 'morpheus',
        job: 'leader',
      });

    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1', 
    }
    const res = http.post(url, data, {headers})

    check(res, {
        "status is ok": (r) => r.status === 201,
        "The response has a name": (r) => r.json().hasOwnProperty('name'),
        "The response has a job":(r)=> r.json().hasOwnProperty('job'),
        "The response has an id": (r) => r.json().hasOwnProperty('id'),
        "The response has a createdat date": (r) => r.json().hasOwnProperty('createdAt'),

    });
    sleep(1);
    

}