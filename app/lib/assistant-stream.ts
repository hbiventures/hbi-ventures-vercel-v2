/** Decode SSE across arbitrary UTF-8/chunk boundaries, without exposing provider events. */
export async function* readSse(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, "\n");
      let boundary: number;
      while ((boundary = buffer.indexOf("\n\n")) >= 0) {
        const frame = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2);
        const data = frame.split("\n").filter(line => line.startsWith("data:")).map(line => line.slice(5).trimStart()).join("\n");
        if (data && data !== "[DONE]") yield JSON.parse(data);
      }
      if (buffer.length > 1000000) throw new Error("Stream frame too large");
      if (done) break;
    }
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}
