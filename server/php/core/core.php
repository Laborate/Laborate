<?php
function objectToArray($object) {
	if (is_object($object)) { $object = get_object_vars($object); }
	if (is_array($object)) { return array_map(__FUNCTION__, $object); }
	else { return $object; }
}

function jsonToarray($json) {
    return objectToArray(json_decode($json));
}

function curlPost($url, $fields) {
    foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
    rtrim($fields_string, '&');
    $ch = curl_init();
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_POST, count($fields));
    curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Accept: application/json"));
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

function curlGet($url, $fields) {
    foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
    rtrim($fields_string, '&');
    $ch = curl_init();
    curl_setopt($ch,CURLOPT_URL, $url."?".$fields_string);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Accept: application/json"));
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

function aesEncrypt($sValue, $sSecretKey) {
    return trim(
        base64_encode(
            mcrypt_encrypt(
                MCRYPT_RIJNDAEL_256,
                $sSecretKey, $sValue,
                MCRYPT_MODE_ECB,
                mcrypt_create_iv(
                    mcrypt_get_iv_size(
                        MCRYPT_RIJNDAEL_256,
                        MCRYPT_MODE_ECB
                    ),
                    MCRYPT_RAND)
                )
            )
        );
}

function aesDecrypt($sValue, $sSecretKey) {
    return trim(
        mcrypt_decrypt(
            MCRYPT_RIJNDAEL_256,
            $sSecretKey,
            base64_decode($sValue),
            MCRYPT_MODE_ECB,
            mcrypt_create_iv(
                mcrypt_get_iv_size(
                    MCRYPT_RIJNDAEL_256,
                    MCRYPT_MODE_ECB
                ),
                MCRYPT_RAND
            )
        )
    );
}
?>