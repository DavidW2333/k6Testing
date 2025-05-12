import http from 'k6/http';
import {check, group, sleep} from 'k6'

export const options = {
    vus: 1,
    iterations: 2,
};

const httpBinTest = () => {
    const httpUrl = 'https://httpbin.org/post'
    const httpData = JSON.stringify({
        name: 'David',
        job: 'test analyst',
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const res = http.post(httpUrl, httpData, {headers})
    console.log('Response Body:', JSON.stringify(res.json(), null, 2));

    check(res, {
        'status is 201': (r) => r.status === 200,
        'The http response has a name': (r) => r.json().json.name === 'David',
        'The http response has a job': (r) => r.json().json.job === 'test analyst'

    })

} 

const reqresTest =() => {
    const url = 'https://reqres.in/api/users'; //free api example
    
    const data = JSON.stringify({
        name: 'morpheus',
        job: 'leader',
      });

    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1', 
    }
    const res = http.post(url, data, {headers})
    const resBody = res.json()

    check(res, {
        "status is ok": (r) => r.status === 201,
        //"The response has a name": (r) => r.json().hasOwnProperty('name'),
        //"The response has a job":(r)=> r.json().hasOwnProperty('job'),
        "The response has an id": (r) => r.json().hasOwnProperty('id'),
        "The response has a createdat date": (r) => r.json().hasOwnProperty('createdAt'),
        "The response has name and job": () => {if ('name' in resBody && 'job' in resBody){
            return resBody.name == 'morpheus' && resBody.job == 'leader'
        }

        else{
            return "There is no name and job";
        }
    }

    });
    sleep(1);
    

}

export default function(){
    reqresTest();
    httpBinTest();
}