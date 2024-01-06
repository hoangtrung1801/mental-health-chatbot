// const mimeTypes = ['audio/webm', 'audio/ogg', 'audio/wav', 'audio/mpeg']
const mimeTypes = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg',
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/m4a',
  'audio/aac',
  'audio/flac',
  'audio/x-flac',
  'audio/x-wav',
  'audio/x-m4a',
  'audio/x-aac',
  'audio/x-mp3',
  'audio/x-mp4',
  'audio/x-mpeg',
  'audio/x-mpeg-3',
  'audio/x-mpeg3',
  'audio/x-mpeg'
]

export default function findMimeType() {
  let mimeType = 'mp3'
  for (let i = 0; i < mimeTypes.length; i++) {
    if (window.MediaRecorder.isTypeSupported(mimeTypes[i])) {
      mimeType = mimeTypes[i]
      break
    }
  }
  return mimeType
  // mimeTypes.forEach(mime => {
  //   if (window.MediaRecorder.isTypeSupported(mime)) {
  //     mimeType = mime
  //     return
  //   }
  // })
  // return mimeType
}
