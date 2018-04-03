// Functions for RSA encryption, decryption and key wrapping

const rsaSettings = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
  hash: {name: "SHA-256"}
};

const iv_const = new Uint8Array([218, 100, 110, 139, 59, 133, 61, 104, 58, 67, 45, 117, 199, 143, 215, 150])
// const iv_const = crypto.getRandomValues(new Uint8Array(16))

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

const importKey = async (exported) => {
  // return crypto.subtle.importKey("jwk", JSON.parse(string_private_key), rsaSettings, true, ["decrypt"]);
  return crypto.subtle.importKey("jwk", exported, rsaSettings, true, exported.key_ops)
}

const generateExportedKeyPair = async () => {
  let pair = await crypto.subtle.generateKey(rsaSettings, true, ["encrypt", "decrypt", "wrapKey", "unwrapKey"])

  let private_key = await crypto.subtle.exportKey("jwk", pair.privateKey)
  let public_key = await crypto.subtle.exportKey("jwk", pair.publicKey)

  return {
    private_key,
    public_key
  };
}

const encryptString = async (str, exported_public_key) => {
  let public_key = await importKey(exported_public_key)
  let cipher = await crypto.subtle.encrypt({
    name: "RSA-OAEP", iv: iv_const
  }, public_key, convertStringToArrayBufferView(str))
  // return (new Uint8Array(cipher)) // ALTERNATE
  return convertArrayBufferViewtoString(new Uint8Array(cipher))
}

const decryptString = async (cipher, exported_private_key) => {
  let private_key = await importKey(exported_private_key)
  // let result = await crypto.subtle.decrypt({ name: "RSA-OAEP", iv: iv_const }, private_key, cipher) // ALTERNATE
  let result = await crypto.subtle.decrypt({ name: "RSA-OAEP", iv: iv_const }, private_key, convertStringToArrayBufferView(cipher))
  let decrypted_data = new Uint8Array(result)
  return convertArrayBufferViewtoString(decrypted_data)
}

const wrapKeyToString = async (aesKey, exportedPublicKey) => {
  let publicKey = await importKey(exportedPublicKey)
  let wrapped = await window.crypto.subtle.wrapKey(
    "raw",
    aesKey,
    publicKey,
    {
      name: "RSA-OAEP",
      hash: {name: "SHA-256"},
    }
  )
  return convertArrayBufferViewtoString(new Uint8Array(wrapped))
}

const unwrapKeyFromString = async (wrappedAesKeyAsString, exportedPrivateKey) => {
  let wrappedAesKey = convertStringToArrayBufferView(wrappedAesKeyAsString)
  let privateKey = await importKey(exportedPrivateKey)
  return window.crypto.subtle.unwrapKey(
    "raw",
    wrappedAesKey,
    privateKey,
    rsaSettings,
    {
      name: "AES-GCM",
      length: 128
    },
    false,
    ["decrypt"]
  )
}

export default {
  generateExportedKeyPair,
  wrapKeyToString,
  unwrapKeyFromString
  // encryptString,
  // decryptString,
  // convertStringToArrayBufferView,
  // convertArrayBufferViewtoString
};
