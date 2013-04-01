<?php
if(!function_exists('objectToArray')) {
    function objectToArray($object) {
    	if (is_object($object)) { $object = get_object_vars($object); }
    	if (is_array($object)) { return array_map(__FUNCTION__, $object); }
    	else { return $object; }
    }
}

if(!function_exists('jsonToArray')) {
    function jsonToArray($json) {
        return objectToArray(json_decode($json));
    }
}

if(!function_exists('array_orderby')) {
    function array_orderby() {
        $args = func_get_args();
        $data = array_shift($args);
        foreach ($args as $n => $field) {
            if (is_string($field)) {
                $tmp = array();
                foreach ($data as $key => $row)
                    $tmp[$key] = $row[$field];
                $args[$n] = $tmp;
                }
        }
        $args[] = &$data;
        call_user_func_array('array_multisort', $args);
        return array_pop($args);
    }
}

if(!function_exists('curlPost')) {
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
}

if(!function_exists('curlGet')) {
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
}

if(!function_exists('aesEncrypt')) {
    function aesEncrypt($value, $secretKey) {
        return trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $secretKey, $value, MCRYPT_MODE_CBC, $secretKey)));
    }
}

if(!function_exists('aesDecrypt')) {
    function aesDecrypt($value, $secretKey) {
        return trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $secretKey, base64_decode($value), MCRYPT_MODE_CBC, $secretKey));
    }
}

if(!function_exists('gen_uuid')) {
    function gen_uuid() {
        return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
            mt_rand( 0, 0xffff ), mt_rand( 0, 0x0fff ) | 0x4000,
            mt_rand( 0, 0x3fff ) | 0x8000, mt_rand( 0, 0xffff ),
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
        );
    }
}
?>