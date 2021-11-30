import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";

import { ConnectMongoDb } from "../../middlewares/ConnectMongoDB";
import { JwtValidator } from "../../middlewares/JwtValidator";

import { TaskRequest } from "../../types/requests/TaskRequest";
import { DefaultResponseMessage } from "../../types/responses/DefaultResponseMessage";
import { Task } from "../../models/Task";

const handleEndpoint = async (
  request: NextApiRequest,
  response: NextApiResponse<DefaultResponseMessage>
) => {
  
  if (request.method !== "POST") {
    const errorMsg = `Method ${request.method} not accepted`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`);
    return response.status(405).json({ error: errorMsg });
  }

  const userId = request.body.userId;
  if(!userId) {
    const errorMsg = `User id not informed`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`);
    return response.status(400).json({ error: errorMsg });
  }

  const body = request.body as TaskRequest;
  validBody(body, response);

  const task = {
    userId: userId,
    name: body.name,
    previsionDate: moment(body.previsionDate).toDate()
  };

  await Task.create(task);
  return response.status(200).json({msg: "Task was created with success"});

};

export function validBody(task: TaskRequest, resp: NextApiResponse) {
    
  if (!task.name || task.name.length < 2) {
      const errorMsg = `Invalid name`;
      console.log(`{jwt: ${""}, error: ${errorMsg}}`)
      return resp.status(400).json({ error: errorMsg });
  }

  const now = moment();
  now.set({hour: 0, minute: 0, second: 0, millisecond: 0});

  if (!task.previsionDate 
    || moment(task.previsionDate).isBefore(now)) {
    const errorMsg = `Invalid prevision date`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`)
    return resp.status(400).json({ error: errorMsg });
  } 
}

export default JwtValidator(ConnectMongoDb(handleEndpoint));
