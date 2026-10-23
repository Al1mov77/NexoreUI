import fs from "fs";

export async function synthesizeSpeech(text, outputFile) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(
      "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EA6340818366A6887130C9E4"
    );

    const audioBuffers = [];

    ws.onopen = () => {
      const config =
        "Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n" +
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: {
                  sentenceBoundaryEnabled: "false",
                  wordBoundaryEnabled: "false",
                },
                outputFormat: "audio-24khz-48kbitrate-mono-mp3",
              },
            },
          },
        });
      ws.send(config);

      const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ru-RU"><voice name="ru-RU-DmitryNeural"><prosody rate="0%" pitch="0%">${text}</prosody></voice></speak>`;
      const reqId = Date.now().toString(16);
      const ssmlMsg =
        `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n` +
        ssml;
      ws.send(ssmlMsg);
    };

    ws.onmessage = async (event) => {
      if (typeof event.data === "string") {
        if (event.data.includes("turn.end")) {
          ws.close();
          const finalBuffer = Buffer.concat(audioBuffers);
          fs.writeFileSync(outputFile, finalBuffer);
          resolve(outputFile);
        }
      } else {
        // Binary audio chunk (first 2 bytes are header length)
        let arrayBuf;
        if (event.data instanceof Blob) {
          arrayBuf = await event.data.arrayBuffer();
        } else if (event.data instanceof ArrayBuffer) {
          arrayBuf = event.data;
        } else {
          arrayBuf = event.data.buffer;
        }

        const buf = Buffer.from(arrayBuf);
        // Header length is 2 bytes big-endian
        if (buf.length > 2) {
          const headerLen = buf.readUInt16BE(0);
          if (buf.length > 2 + headerLen) {
            const audioData = buf.subarray(2 + headerLen);
            audioBuffers.push(audioData);
          }
        }
      }
    };

    ws.onerror = (err) => {
      reject(err);
    };
  });
}
