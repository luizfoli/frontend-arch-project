import type { NextApiRequest, NextApiResponse } from "next";
import md5 from "md5";

import { ConnectMongoDb } from "../../middlewares/ConnectMongoDB";

import { User } from "../../models/User";
import { DefaultResponseMessage } from "../../types/responses/DefaultResponseMessage";
import { UserRequest } from "../../types/requests/UserRequest";

const handleEndpoint = async (
  request: NextApiRequest,
  response: NextApiResponse<DefaultResponseMessage>
) => {

    if (request.method !== "POST") {
        const errorMsg = `Method ${request.method} not accepted`;
        console.log(`{jwt: ${""}, error: ${errorMsg}}`);
        return response.status(405).json({ error: errorMsg });
    }

    const user = request.body as UserRequest;
    validBody(user, response);

    if(await isUsernameInUse(user.email)) {
        const errorMsg = `Email already in use`;
        console.log(`{jwt: ${""}, error: ${errorMsg}}`)
        return response.status(422).json({ error: errorMsg });
    }

    user.password = md5(user.password);
    await User.create(user);

    const successMsg = `User created with success`;
    console.log(`{jwt: ${""}, msg: ${successMsg}}`)
    return response.status(200).json({ msg: successMsg });
};

/**
 * Method responsible for valid the req body.
 * If the value from body dont are valid returns bad request.
 * @param user 
 * @param resp 
 * @author luizfoli
 */

export function validBody(user: UserRequest, resp: NextApiResponse) {
    
    if (!user.name || user.name.length < 2) {
        const errorMsg = `Invalid name`;
        console.log(`{jwt: ${""}, error: ${errorMsg}}`)
        return resp.status(400).json({ error: errorMsg });
      }
    
      if (!user.email || user.email.length < 4 || user.email.indexOf("@") === -1) {
        const errorMsg = `Invalid email`;
        console.log(`{jwt: ${""}, error: ${errorMsg}}`)
        return resp.status(400).json({ error: errorMsg });      }
    
      if (!user.password || user.password.length < 4) {
        const errorMsg = `Invalid password`;
        console.log(`{jwt: ${""}, error: ${errorMsg}}`)
        return resp.status(400).json({ error: errorMsg });
      }
}

export async function isUsernameInUse(email: string) {
    const user = await User.find({
        email: email
    });

    return user && user.length > 0;
}

export default ConnectMongoDb(handleEndpoint);
