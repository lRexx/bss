<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');
/*
 * Clase para la exportación de resultados a excel
 * @version 0.1 Primera version
 */
require_once APPPATH . "/third_party/PHPExcel/Classes/PHPExcel.php";
//require_once APPPATH . "/third_party/PHPExcel/Classes/PHPExcel/Reader/Excel2007.php";
//require_once APPPATH . "/third_party/PHPExcel/Classes/PHPExcel/Writer/Excel2007.php";
//require_once APPPATH . "/third_party/PHPExcel/Classes/PHPExcel/IOFactory.php";

class Excel extends PHPExcel
{
	public function __construct()
	{
		parent::__construct();
	}
}

