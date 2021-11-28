import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'

import { DefaultResponseMessage } from '../types/responses/DefaultResponseMessage';

export const ConnectMongoDb = (handler: NextApiHandler) =>
  async (request: NextApiRequest, response: NextApiResponse<DefaultResponseMessage>) => {

    const { DB_CONNECTION_STRING } = process.env;
    if (!DB_CONNECTION_STRING) {
      return response.status(500).json({ msg: 'ENV Database not found' })
    }

    if (!mongoose.connections[0].readyState) {
      console.log(`Start to connect with MongoDB`)
      await mongoose.connect(DB_CONNECTION_STRING);
    }

    return handler(request, response);
  }