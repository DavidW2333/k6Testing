import http from 'k6/http';
import {check, group, sleep} from 'k6'

export const options = {
    vus: 3,
    iterations: 4,
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
//post request
const reqresPostTest =() => {
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
//get request
const reqresGetTest = () => {
    const reqresUrl = 'https://reqres.in/api/users?page=2';
    const headers = {
        'Content-Type': 'application/json'
    };

    const res = http.get(reqresUrl);
    check(res, {
        "reqresTest2 response status is ok": (r) => r.status === 200,
        "The response has 2 pages": (r) => r.json().page === 2,
        "The response has 5 datas": (r) => r.json().data.length === 6
    });

    //console.log(JSON.stringify(res.json(), null, 2))



}
//http put request
const reqresPutTest = () => {
    const reqresPutTestURL = "https://reqres.in/api/users/2";
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1',
        
    };
    const data = JSON.stringify({
        "name": "David New Name",
        "job": "software Test engineer"
    })
    const res = http.put(reqresPutTestURL, data, {headers} )
    check(res, {
        "reqresPutTest response status is ok": (r) => r.status ===200,
        "The response has updated the name and the job": ()=> {
            if ('name' in res.json() && 'job' in res.json()){
                return res.json().name === "David New Name" && res.json().job ==="software Test engineer"
            }

            else{
                return "the updates has failed"
            }

        }
    });
    console.log(JSON.stringify(res.json(), null, 2))
}

export default function(){
    reqresPostTest();
    reqresGetTest();
    reqresPutTest();
    httpBinTest();
    //K6_OUT=influxdb=http://localhost:8086/k6 k6 run /Users/seanreader/k6performanceTesting/postRequesttest.js
}