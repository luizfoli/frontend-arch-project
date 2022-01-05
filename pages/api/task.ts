import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";

import { ConnectMongoDb } from "../../middlewares/ConnectMongoDB";
import { JwtValidator } from "../../middlewares/JwtValidator";

import { TaskRequest } from "../../types/requests/TaskRequest";
import { DefaultResponseMessage } from "../../types/responses/DefaultResponseMessage";
import { Task } from "../../models/Task";
import { GetTasksParams } from "../../types/requests/GetTaskParams";

const handleEndpoint = async (
  request: NextApiRequest,
  response: NextApiResponse<DefaultResponseMessage>
) => {

  const { userId } = req.body || req.query;
  
  if (request.method !== "POST" 
    && request.method !== "PUT"
    && request.method !== "DELETE"
    && request.method !== "GET") {
    const errorMsg = `Method ${request.method} not accepted`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`);
    return response.status(405).json({ error: errorMsg });
  }
  
  if(!request.body.userId && !request.query.userId) {
    const errorMsg = `User id not informed`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`);
    return response.status(400).json({ error: errorMsg });
  }

  const method = request.method;
  if(method === "POST")
    return await createTask(request, response)

  else if (method === "PUT")
    return await updateTask(request, response);

  else if (method === "DELETE")
    return await deleteTask(request, response);

  else
    return await getTasks(request, response, "");

};

export async function createTask(request: NextApiRequest, response: NextApiResponse) {

  const body = request.body;
  validateBody(body.name, body.previsionDate, response);

  const task = {
    userId: request.body.userId,
    name: body.name,
    previsionDate: moment(body.previsionDate).toDate()
  };

  await Task.create(task);
  return response.status(200).json({msg: "Task was created with success"});
}

export async function updateTask(request: NextApiRequest, response: NextApiResponse) {
  const body = request.body;
  validateBody(body.name, body.previsionDate, response);
  
  const taskId = request.query?.id;
  
  if(!taskId) {
    const errorMsg = `Task id not informed`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`)
    return response.status(400).json({ error: errorMsg });
  }

  const task = await Task.findById(taskId);

  if(!task && task.userId !== request.body.userId) {
    const errorMsg = `Task not found`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`)
    return response.status(400).json({ error: errorMsg });
  }

  task.name = body.name;
  task.previsionDate = body.previsionDate;
  task.finishDate = body.finishDate;

  await Task.findByIdAndUpdate({_id: taskId}, task);
  return response.status(200).json({msg: "Task was updated with success"});
}

export async function deleteTask(request: NextApiRequest, response: NextApiResponse) {
  const taskId = request.query?.id;
  
  if(!taskId) {
    const errorMsg = `Task id not informed`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`)
    return response.status(400).json({ error: errorMsg });
  }

  const task = await Task.findById(taskId);

  if(!task && task.userId !== request.body.userId) {
    const errorMsg = `Task not found`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`)
    return response.status(400).json({ error: errorMsg });
  }

  await Task.findByIdAndDelete({_id: taskId}, task);
  return response.status(200).json({msg: "Task was deleted"});
}

export async function getTasks(request: NextApiRequest, 
  response: NextApiResponse, userId: string) {

  const params = request.query as GetTasksParams;
  const query = {
    userId
  } as any

  if(params?.previsionDateStart){
    const startDate = moment(params?.previsionDateStart).toDate();
    query.previsionDate = {$gte : startDate};
  }

  if(params?.previsionDateEnd){
      const endDate = moment(params?.previsionDateEnd).toDate();
      
      if(!query.previsionDate){
          query.previsionDate = {}
      }

      query.previsionDate.$lte = endDate;
  }

  if(params?.status){
      const status = parseInt(params?.status);
      switch(status){
          case 1 : query.finishDate = null;
              break;
          case 2 : query.finishDate = {$ne : null};
      }
  }

  const result = await Task.find(query);
  return response.status(200).json({result})

}


export function validateBody(name: string, previsionDate: string, resp: NextApiResponse) {
    
  if (!name || name.length < 2) {
      const errorMsg = `Invalid name`;
      console.log(`{jwt: ${""}, error: ${errorMsg}}`)
      return resp.status(400).json({ error: errorMsg });
  }

  const now = moment();
  now.set({hour: 0, minute: 0, second: 0, millisecond: 0});

  if (!previsionDate 
    || moment(previsionDate).isBefore(now)) {
    const errorMsg = `Invalid prevision date`;
    console.log(`{jwt: ${""}, error: ${errorMsg}}`)
    return resp.status(400).json({ error: errorMsg });
  } 
}

export default JwtValidator(ConnectMongoDb(handleEndpoint));
