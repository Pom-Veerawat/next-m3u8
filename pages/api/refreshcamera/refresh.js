// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { copyonlynew } from "@/utilities/filescopy";

export default function handler(req, res) {
    //console.log(req.body);
    const {guid} = req.body;
    //console.log(guid);
    if(req.method=='POST')
    {
        copyonlynew(process.env.ORIGINAL_M3U8,process.env.PUBLIC_M3U8_PATH+'/'+guid)
        console.log('in api copying',guid)
    }
    else{

        return res.status(200).json({error:'error'})
    }




    res.status(200).json({ name: 'John Doe' })
  }
  