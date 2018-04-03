// Functions for RSA encryption, decryption and key wrapping

const iv_const = new Uint8Array([218, 100, 110, 139, 59, 133, 61, 104, 58, 67, 45, 117])
const algo = { name: "AES-GCM" }

const convertStringToArrayBufferView = (str) => {
    var bytes = new Uint8Array(str.length);
    for (var iii = 0; iii < str.length; iii++)
    {
        bytes[iii] = str.charCodeAt(iii);
    }

    return bytes;
}
const convertArrayBufferViewtoString = (buffer) => {
    var str = "";
    for (var iii = 0; iii < buffer.byteLength; iii++)
    {
        str += String.fromCharCode(buffer[iii]);
    }

    return str;
}

const generateKey = () => {
  return window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 128
    },
    true,
    ["encrypt", "decrypt"]
  )
}

const encryptString = async (str, key) => {
  // let key = crypto.subtle.importKey("jwk", exported, algo, true, exported.key_ops)
  let cipher = await window.crypto.subtle.encrypt({
    ...algo,
    iv: iv_const,
    tagLength: 128,
  }, key, convertStringToArrayBufferView(str))
  return convertArrayBufferViewtoString(new Uint8Array(cipher))
}

const decryptString = async (cipher, key) => {
  let result = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv_const,
      tagLength: 128,
    },
    key,
    convertStringToArrayBufferView(cipher)
  )
  let decrypted_data = new Uint8Array(result)
  return convertArrayBufferViewtoString(decrypted_data)
}


export default {
  generateKey,
  // generateExportedKeyPair,
  encryptString,
  decryptString,
  // convertStringToArrayBufferView,
  // convertArrayBufferViewtoString
};
