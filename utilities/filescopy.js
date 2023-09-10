import {
  copySync,
  copyFileSync,
  existsSync,
  readdirSync,
  statSync,
  writeFileSync,
  readFileSync,
} from "fs-extra";

export function writestampfile(src, dest) {
  const allfiles = readdirSync(src);
  let nameArr = [];
  let mtimems = [];
  for (let index = 0; index < allfiles.length; index++) {
    const element = allfiles[index];
    if (element.includes(".m3u8") || element.includes(".ts")) {
      const fullnamesrc = src + "/" + element;
      const fullnamedest = dest + "/" + element;
      //console.log(fullnamesrc);
      //console.log(fullnamedest);
      nameArr.push(element);

      const mtimeMS = statSync(fullnamesrc).mtimeMs;
      mtimems.push(mtimeMS);
    }
  }

  const content = { name: nameArr, mtime: mtimems };
  writeFileSync(dest + "/test.txt", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
}

export function copyonlynew(src, dest) {
  const allfiles = readdirSync(src);
  if (!existsSync(dest + "/test.txt")) {
    writestampfile(src, dest);
  }

  const data = JSON.parse(readFileSync(dest + "/test.txt"));

  const { name, mtime } = data;
  //console.log(name,mtime);
  //return;
  let isCopy=false;
  for (let index = 0; index < allfiles.length; index++) {
    const element = allfiles[index];
    if (element.includes(".m3u8") || element.includes(".ts")) {
      const fullnamesrc = src + "/" + element;
      const fullnamedest = dest + "/" + element;
      //console.log(fullnamesrc);
      //console.log(fullnamedest);
      if (!existsSync(fullnamedest)) {
        //ไม่มีก็ก็อบมา
        copySync(fullnamesrc, fullnamedest, { overwrite: true });
        isCopy = true;
      } else {
        //ถ้ามี แต่ว่า เวลาอัพเดทกว่าก็ก็อบมา
        const fileorigin = statSync(fullnamesrc);
        const filemtimeMs = fileorigin.mtimeMs;
        const lasttimems = mtime[name.indexOf(element)];
        if (filemtimeMs != lasttimems) {
          copySync(fullnamesrc, fullnamedest, { overwrite: true });

          console.log("copy", element);
          isCopy = true;
        }
        //console.log(filemtimeMs)
        //const filedes = statSync(fullnamedest);
        //console.log(fileorigin);
        //console.log(filedes);
      }
    }
  }
  if(isCopy)
  {
    writestampfile(src, dest)
  }
}
