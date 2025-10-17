<?php if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Mail_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function sendMail($title, $to, $body, $subject)
    {
        $param = $this->getMailSmtp();
        //print_r($param['0']['value']);
        //TASS
        $config = array(
            'protocol' => 'smtp',
            //'smtp_host'   => 'bss.com.ar',
            'smtp_host' => 'smtp.gmail.com',
            'smtp_user' => $param['0']['value'],
            'smtp_pass' => $param['1']['value'],
            //'smtp_port'   => '465',
            'smtp_port' => 587, // Use 587 for TLS (recommended)
            'smtp_crypto' => 'tls', // TLS is recommended for port 587
            'mailtype' => 'html',
            'wordwrap' => TRUE,
            'charset' => 'utf-8',
            'smtp_timeout' => 30,
            'crlf' => "\r\n",
            'newline' => "\r\n"
        );
        //LOCAL
        #$config = array(
        #	'protocol'  => 'smtp',
        #	'smtp_host' => 'ssl://smtp.googlemail.com',
        #	'smtp_port' => 465,
        #	'smtp_user' => 'rexx84@gmail.com',
        #	'smtp_pass' => 'Sofia.1407',
        #	'mailtype'  => 'html',
        #	'charset'   => 'utf-8'
        #);

        $this->load->library('email', $config);
        $this->email->set_newline("\r\n");
        $this->email->from($param['0']['value'], 'BSS Seguridad');
        $this->email->subject($subject);


        $body = '
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//ES" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" lang="es">
            <head>
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <style>
                @media screen {
                    @font-face {
                        font-family: monserrateExtended;
                        src: url(https://' . BSS_HOST . '/fonts/montserrat/Montserrat-Medium.otf);
                    }
                }
                body{
                    font-style: normal;
                    font-family: monserrateExtended;
                }
                .logo_mail {
                    display: block;
                    width: 212px !important;
                    height: 71px !important;
                    max-width: 110% !important;
                    max-height: 100% !important;
                }
                </style>
            </head>
            <body style="text-align: center;">
            <table bgcolor="#427A9D" cellpadding="10" cellspacing="0" border="0" width="100%" align="center" style="max-width:100%; font-family: arial; font-size: 13px; color: #555555; padding:2%">
              <tr>
                <td width="100%" >
                  <!-- HEADER-->
                  <table style="max-width: 768px;min-width: 100%;border-collapse: collapse;" cellpadding="10" cellspacing="0" bgcolor="#eeeeee" border="0" align="left">
                    <tbody>
                        <tr width="100%" bgcolor="#ffffff">
                            <td width="40%" style="text-align:left;" bgcolor="#ffffff">
                                <img src="https://' . BSS_HOST . '/images/logo_2.png" alt="logos juntos.png" width="60%" class="logo_mail">
                            </td>
                            <td width="60%" style="text-align:left"><h1 style="font-size:2vw;" bgcolor="#ffffff">' . $title . '</h1></td>
                        </tr>
                    </tbody>
                </table>
                </td>
              </tr>
              <tr>
                <td>
                <!-- BODY-->
                <table style="max-width: 768px;min-width: 100%;" cellpadding="10" cellspacing="0" border="0" align="left">
                    ' . $body . '
                </table>
                </td>
              </tr>
              <tr>
                <td>
                <!-- FOOTER-->
                <table style="max-width: 768px;min-width: 100%;border-collapse: collapse; padding-top:2%; padding-bottom:2%" cellpadding="10" border="0" align="left">
                    <tbody>
                        <tr width="100%" bgcolor="#0F2A37">
                        <!--<td align="left" valign="baseline" style="color:#fff; font-size:0.8vw;">
                            Buenos Airies,&nbsp;CABA
                          </td>-->
                          <td align="center" valign="baseline" style="color:#fff; font-size:0.8vw;">
                         &copy;  <a href="" target="_blank" title="" style="text-decoration: none; color: #fff;">BSS&nbsp;Seguridad&nbsp;2023</a>
                          </td>
                        </tr>
                    </tbody>
                </table>
                </td>
              </tr>
            </table>
            </body>
            </html>';

        /**
         * <img src='https://win-social.com/win_page/img/Asset_1.png'>
        <div>
        ".$body."
        </div>
         */
        #$this->email->message("<h1>Welcome, ${to}!!!</h1>");
        $this->email->message($body);
        $this->email->to($to);
        //$this->email->send();
        if (!$this->email->send()) {
            $r = $this->email->print_debugger(); // Generate error
        } else {
            $r = "Enviado";
        }




        return $r;
    }
    public function sendMail2($title, $to, $body, $subject)
    {
        $param = $this->getMailSmtp();
        //TASS
        $config = array(
            'protocol' => 'smtp',
            'smtp_host' => 'bss.com.ar',
            'smtp_user' => $param['0']['value'],
            'smtp_pass' => $param['1']['value'],
            'smtp_port' => '465',
            'mailtype' => 'html',
            'wordwrap' => TRUE,
            'charset' => 'utf-8',
            'smtp_timeout' => 30,
            'smtp_crypto' => 'ssl'
        );
        //LOCAL
        #$config = array(
        #	'protocol'  => 'smtp',
        #	'smtp_host' => 'ssl://smtp.googlemail.com',
        #	'smtp_port' => 465,
        #	'smtp_user' => 'rexx84@gmail.com',
        #	'smtp_pass' => 'Sofia.1407',
        #	'mailtype'  => 'html',
        #	'charset'   => 'utf-8'
        #);

        $this->load->library('email', $config);
        $this->email->set_newline("\r\n");
        $this->email->from($param['0']['value']);
        $this->email->subject($subject);


        $body = "
            <!DOCTYPE html>
            <html lang='es'>
            <head>
            </head>
            <body style='  text-align: center;'>
           <img width='100%' src='https://win-social.com/img/Asset_1.png'>
           <br>

           <br>
            <div style='
            margin-left:auto;
            margin-right:auto;
            font-size: 22px;
            color: #656464;
            font-family: sans-serif;
            text-align: justify;'>
           " . $body . "
           </div>
           <br>
            <img width='100%' src='https://win-social.com/img/Asset_2.png'>
            </body>
            </html>";

        /**
         * <img src='https://win-social.com/win_page/img/Asset_1.png'>
        <div>
        ".$body."
        </div>
         */

        $this->email->message($body);
        $this->email->to($to);
        $this->email->send();


        $r = $this->email->print_debugger();

        return "Enviado";
        return $r;
    }
    function send()
    {
        $this->load->config('email');
        $this->load->library('email');

        $from = $this->config->item('smtp_user');
        $to = $this->input->post('to');
        $subject = $this->input->post('subject');
        $message = $this->input->post('message');

        $this->email->set_newline("\r\n");
        $this->email->from($from);
        $this->email->to($to);
        $this->email->subject($subject);
        $this->email->message($message);

        if ($this->email->send()) {
            echo 'Your Email has successfully been sent.';
        } else {
            show_error($this->email->print_debugger());
        }

        $filename = '/img/photo1.jpg';
        $this->email->attach($filename);
        foreach ($list as $address) {
            $this->email->to($address);
            $cid = $this->email->attachment_cid($filename);
            $this->email->message('<img src="cid:' . $cid . '" alt="photo1" />');
            $this->email->send();
        }
    }
    //Get the main parameter of the system mail stored in the DB
    private function getMailSmtp()
    {
        $param = null;


        $query = $this->db->select("*")->from("tb_sys_param")->get();
        if ($query->num_rows() > 0) {
            $param = $query->result_array();
        }
        return $param;
    }

}
?>

