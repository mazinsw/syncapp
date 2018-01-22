<?php

$content = file_get_contents(dirname(__DIR__) . '/.env');
# remove comments
$content = preg_replace('/[ \t]*#[^\n]*\n/', '', $content);
$env  = parse_ini_string($content, true, INI_SCANNER_RAW);

$value = array (
	'host' => $env['MYSQL_HOST'],
	'user' => $env['MYSQL_USER'],
	'pass' => $env['MYSQL_PASSWORD'],
	'name' => $env['MYSQL_DATABASE']
);
