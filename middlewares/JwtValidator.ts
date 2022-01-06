import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { DefaultResponseMessage } from '../types/responses/DefaultResponseMessage';

export const JwtValidator = (handler : NextApiHandler) => 
    async (req : NextApiRequest, 
      res : NextApiResponse<DefaultResponseMessage>) => {

    const {PRIVATE_KEY} = process.env;
    if(!PRIVATE_KEY){
        return res.status(500).json({error : 'ENV PRIVATE KEY não informada na execução do projeto'});
    }

    if(!req || !req.headers){
        return res.status(400).json({error : 'Não foi possível validar o token de segurança'});
    }

    if(req.method !== 'OPTIONS'){
        try{
            const authorization = req.headers['authorization'];
            if(!authorization){
                return res.status(400).json({error : 'Não foi possível validar o token de segurança'});
            }
    
            const token = authorization.substr(7);
            if(!token){
                return res.status(400).json({error : 'Token de segurança não informado'});
            }
    
            const decode = await jwt.verify(token, PRIVATE_KEY) as JwtPayload;
            if(!decode){
                return res.status(400).json({error : 'Não foi possível validar o token de segurança'});
            }
    
            if(req.body){
                req.body.userId = decode._id;
            }else if(req.query){
                req.query.userId = decode._id;
            }
        }catch(e){
            return res.status(400).json({error : 'Não foi possível validar o token de segurança'});
        }
    }

    return handler(req, res);
}