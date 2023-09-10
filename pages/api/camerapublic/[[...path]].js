import fs from "fs";

export default function handler(req, res) {
  //console.log("1");
  if (req.query.path && req.query.path.length) {
    const publicDir = process.env.PUBLIC_M3U8_PATH;
    const fileUrl = req.query.path.join("/");
    //console.log("2");
    //console.log(publicDir+'/' + fileUrl);
    /* fs.readFileSync(publicDir+'/' + fileUrl, (error, data) => {
				if(error) {
					return res.status(404).send(error)
				}
				return res.status(200).send(data)
			}) */
     const data= fs.readFileSync(publicDir+'/' + fileUrl)
      return res.status(200).send(data)
  } else {
    res.status(404).send(null);
  }

}

