<?php
$request = explode(".", $_SERVER["HTTP_HOST"]);
array_shift($request);
header("Location: http://".implode(".", $request)."/");
?>