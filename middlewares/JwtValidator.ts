import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt, { JwtPayload } from "jsonwebtoken";

import { DefaultResponseMessage } from '../types/responses/DefaultResponseMessage';

export const JwtValidator = (handler: NextApiHandler) =>
  async (request: NextApiRequest, response: NextApiResponse<DefaultResponseMessage>) => {

    try {
      const { PRIVATE_KEY } = process.env;

      if(!PRIVATE_KEY) {
        const errorMsg = 'ENV PRIVATE_KEY not found';
        console.log(errorMsg);
        return response.status(500).json({ msg: errorMsg})
      }
  
      if(!request || !request.headers 
        || !request.headers.authorization
        || !request.headers["authorization"].substring(7)) {
        const errorMsg = 'Bearer token not informed';
        console.log(errorMsg);
        return response.status(400).json({ msg: errorMsg})
      }
  
      if(request.method === "OPTIONS") {
        return handler(request, response);
      }
  
      const token = request.headers["authorization"].substring(7);
      const decode = await jwt.verify(token, PRIVATE_KEY) as JwtPayload;

      if(request.method === "GET") {
        request.query.userId = decode._id;
      } else {
        request.body.userId = decode._id;
      }
      
    } catch(e) {
    }


    return handler(request, response);
  }