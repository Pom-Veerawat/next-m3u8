import * as fs from "fs";
import { copySync } from "fs-extra";
import path from "path";
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import ReactDOM from "react-dom";
import react from "react";
//import ReactHlsPlayer from 'react-hls-player';

import dynamic from "next/dynamic";
import { writestampfile } from "@/utilities/filescopy";
const ReactHlsPlayer = dynamic(() => import("react-hls-player"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

/* const DynamicHeader = dynamic(() => import("react-hls-player"), {
  loading: () => <p>Loading...</p>,
}); */
function CamaraLive(props) {
  console.log(props); /*  */

  const videoRef = useRef(null);
  useEffect(() => {
    const intervalId = setInterval(() => {
      //assign interval to a variable to clear it.
      //setState(state => ({ data: state.data, error: false, loading: true }))
      fetch("/api/refreshcamera/refresh", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guid: props.guid }),
      });
      console.log('refreshing...');
    }, 10000);

    return () => clearInterval(intervalId); //This is important
  }, []);
  const src = "/api/camerapublic/" + props.guid + "/namacctv.m3u8";
  //console.log(src);
  /* useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.controls = true;
    //const defaultOptions = {};
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // This will run in safari, where HLS is supported natively
      video.src = src;
    } else if (Hls.isSupported()) {
      // This will run in all other modern browsers

      const hls = new Hls();
      hls.loadSource(src);
      //const player = new Plyr(video, defaultOptions);
      hls.attachMedia(video);
    } else {
      console.error(
        "This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API"
      );
    }
  }, [src, videoRef]); */

  return (
    <ReactHlsPlayer
      src={src}
      autoPlay={true}
      controls={true}
      muted={true}
      width="100%"
      height="auto"
      
      /* hlsConfig={{
        maxLoadingDelay: 4,
        minAutoBitrate: 0,
        lowLatencyMode: true,
      }} */
    />
  );
}
export default CamaraLive;

export function buildFeedbackPath(guid) {
  return process.env.PUBLIC_M3U8_PATH + "/" + guid;
  return path.join(process.cwd(), "public", "data", guid);
}

export async function getServerSideProps(context) {
  const { params } = context;

  const guid = params.guid;
  if (fs.existsSync(buildFeedbackPath(guid))) {
    console.log("The directory exists");
  } else {
    fs.mkdirSync(buildFeedbackPath(guid));
  }
  //console.log(process.env.ORIGINAL_M3U8);
  //console.log(process.env.PUBLIC_M3U8_PATH+'/'+guid);
  copySync(process.env.ORIGINAL_M3U8, buildFeedbackPath(guid), {
    overwrite: true,
  });
  writestampfile(
    process.env.ORIGINAL_M3U8,
    process.env.PUBLIC_M3U8_PATH + "/" + guid
  );

  //copyonlynew(process.env.ORIGINAL_M3U8,process.env.PUBLIC_M3U8_PATH+'/'+guid)
  //console.log('aa');
  return {
    props: {
      guid: guid,
    },
  };
}
