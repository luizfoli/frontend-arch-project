import axios, {Method} from "axios";

export const executeRequest = async(endpoint: string, method: Method, body?: any) => {
    const headers = {"Content-Type":"application/json"} as any;
    const URL = "http://localhost:3000/api/" + endpoint;
    console.log({msg: `Executing method ${method} in ${URL} with body ${body} and headers ${headers}`});
    return await axios.request({url: URL, method, data:body? body : "", headers});
}
