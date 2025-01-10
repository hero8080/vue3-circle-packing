function isDataUrl(url: string) {
  const prefix = 'data:'
  return url.substr(0, prefix.length) === prefix
}

/**
 * Converts an image at `url` to base64-encoded data uri.
 * The mime type of the image is inferred from the `url` file extension.
 */
export function imageToDataUri(
  url: string,
  callback: (err: Error | null, dataUri?: string) => any,
) {
  // No need to convert to data uri if it is already in data uri.
  if (!url || isDataUrl(url)) {
    // Keep the async nature of the function.
    setTimeout(() => callback(null, url))
    return
  }

  const onError = () => {
    callback(new Error(`Failed to load image: ${url}`))
  }

  const onLoad = window.FileReader
    ? // chrome, IE10+
    (xhr: XMLHttpRequest) => {
      if (xhr.status === 200) {
        const reader = new FileReader()
        reader.onload = (evt) => {
          const dataUri = evt.target!.result as string
          callback(null, dataUri)
        }

        reader.onerror = onError
        reader.readAsDataURL(xhr.response)
      } else {
        onError()
      }
    }
    : (xhr: XMLHttpRequest) => {
      const toString = (u8a: Uint8Array) => {
        const CHUNK_SZ = 0x8000
        const c = []
        for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
          c.push(
            String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)),
          )
        }
        return c.join('')
      }

      if (xhr.status === 200) {
        let suffix = url.split('.').pop() || 'png'
        if (suffix === 'svg') {
          suffix = 'svg+xml'
        }
        const meta = `data:image/${suffix};base64,`
        const bytes = new Uint8Array(xhr.response)
        const base64 = meta + btoa(toString(bytes))
        callback(null, base64)
      } else {
        onError()
      }
    }

  const xhr = new XMLHttpRequest()
  xhr.responseType = window.FileReader ? 'blob' : 'arraybuffer'
  xhr.open('GET', url, true)
  xhr.addEventListener('error', onError)
  console.log(onLoad);
  xhr.addEventListener('load', () => onLoad(xhr))
  xhr.send()
}

