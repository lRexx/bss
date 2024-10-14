<?php
require_once __DIR__.'/vendor/mercadopago/sdk/lib/mercadopago.php';
date_default_timezone_set("America/Argentina/Buenos_Aires");
header("Access-Control-Allow-Origin: *");


//Receive the RAW post data.
$content = file_get_contents('php://input');
$json    = json_decode($content);

$mp = new MP($json->{"clienteid"}, $json->{"clientesecret"});


$preference_data = [
    "items"              => [
        [
            "title"       => $json->{"title"},
            "quantity"    => 1,
            "currency_id" => $json->{"currency_id"},
            "unit_price"  => $json->{"unit_price"},
            "id"          => $json->{"id"},
            "picture_url" => "https://seeklogo.com/images/M/mercado-pago-logo-52B7182205-seeklogo.com.png",
            "category_id" => "electronics",
            "description" => $json->{"description"},
        ],
    ],
    //"payer" =>[
    //    "name"    => "David",
    //    "surname" => "Rincon",
    //],
    "payment_methods"    => [
        "installments" => 1,
    ],

    //"external_reference" => date('Ymd-His'),
    "notification_url"   => $json->{"notification_url"},
    "back_urls"          => [
        "success" => $json->{"back_url"},
    ],
    "binary_mode"        => true,
    "external_reference" => $json->{"external_reference"},

];

$mp->sandbox_mode(true); //HABILITAR PARA LAS PRUEBAS


$preference = $mp->create_preference($preference_data);
//var_dump(json_encode($preference, true));
if ($preference != null) {
    $URL = $preference['response']['init_point'];
    header('Content-type: application/json; charset=utf-8');

    // GUARDAMOS LA INFO //
    print_r(json_encode($preference, true, JSON_UNESCAPED_SLASHES));
    exit();
}


?>

