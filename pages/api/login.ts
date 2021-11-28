import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import md5 from "md5";

import { ConnectMongoDb } from "../../middlewares/ConnectMongoDB";

import { User } from "../../models/User";
import { DefaultResponseMessage } from "../../types/responses/DefaultResponseMessage";
import { LoginRequest } from "../../types/requests/LoginRequest";
import { LoginResponse } from "../../types/responses/LoginResponse";

const handleEndpoint = async (
  request: NextApiRequest,
  response: NextApiResponse<DefaultResponseMessage | LoginResponse>) => {

    const { PRIVATE_KEY } = process.env;

    if (!PRIVATE_KEY) {
        return response.status(500).json({ msg: "ENV PRIVATE_KEY not found" });
    }

    if (request.method !== "POST") {
        const errorMsg = `Method ${request.method} not accepted`
        console.log(`{jwt: ${""}, error: ${errorMsg}}`)
        return response.status(405).json({error: errorMsg});
    }

    const body = request.body as LoginRequest;

    if(!body.username) {
        const errorMsg = `Username invalid or not informed`;
        console.log(`{jwt: ${""}, error: ${errorMsg}}`)
        return response.status(400).json({error: errorMsg});
    }

    if(!body.password) {
        const errorMsg = `Password invalid or not informed`;
        console.log(`{jwt: ${""}, error: ${errorMsg}}`)
        return response.status(400).json({error: errorMsg});
    }

    const user = await findExistingUser(body.username, body.password);

    if(user) {
        const token = jwt.sign({_id: user._id}, PRIVATE_KEY);
        return response.status(200).json({
            name: user.name,
            email: user.email,
            token
        });
    }

    const errorMsg = `Invalid username or password`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`)
    return response.status(401).json({ error: errorMsg });
};

export async function findExistingUser(username: string, password: string) {
    const user = await User.findOne({
        email: username,
        password: md5(password)
    });

    return user;
}


export default ConnectMongoDb(handleEndpoint);
