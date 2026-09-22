<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Display Debug backtrace
|--------------------------------------------------------------------------
|
| If set to TRUE, a backtrace will be displayed along with php errors. If
| error_reporting is disabled, the backtrace will not display, regardless
| of this setting
|
*/
defined('SHOW_DEBUG_BACKTRACE') OR define('SHOW_DEBUG_BACKTRACE', TRUE);

/*
|--------------------------------------------------------------------------
| File and Directory Modes
|--------------------------------------------------------------------------
|
| These prefs are used when checking and setting modes when working
| with the file system.  The defaults are fine on servers with proper
| security, but you may wish (or even need) to change the values in
| certain environments (Apache running a separate process for each
| user, PHP under CGI with Apache suEXEC, etc.).  Octal values should
| always be used to set the mode correctly.
|
*/
defined('FILE_READ_MODE')  OR define('FILE_READ_MODE', 0644);
defined('FILE_WRITE_MODE') OR define('FILE_WRITE_MODE', 0666);
defined('DIR_READ_MODE')   OR define('DIR_READ_MODE', 0755);
defined('DIR_WRITE_MODE')  OR define('DIR_WRITE_MODE', 0755);

/*
|--------------------------------------------------------------------------
| File Stream Modes
|--------------------------------------------------------------------------
|
| These modes are used when working with fopen()/popen()
|
*/
defined('FOPEN_READ')                           OR define('FOPEN_READ', 'rb');
defined('FOPEN_READ_WRITE')                     OR define('FOPEN_READ_WRITE', 'r+b');
defined('FOPEN_WRITE_CREATE_DESTRUCTIVE')       OR define('FOPEN_WRITE_CREATE_DESTRUCTIVE', 'wb'); // truncates existing file data, use with care
defined('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE')  OR define('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE', 'w+b'); // truncates existing file data, use with care
defined('FOPEN_WRITE_CREATE')                   OR define('FOPEN_WRITE_CREATE', 'ab');
defined('FOPEN_READ_WRITE_CREATE')              OR define('FOPEN_READ_WRITE_CREATE', 'a+b');
defined('FOPEN_WRITE_CREATE_STRICT')            OR define('FOPEN_WRITE_CREATE_STRICT', 'xb');
defined('FOPEN_READ_WRITE_CREATE_STRICT')       OR define('FOPEN_READ_WRITE_CREATE_STRICT', 'x+b');

/*
|--------------------------------------------------------------------------
| Exit Status Codes
|--------------------------------------------------------------------------
|
| Used to indicate the conditions under which the script is exit()ing.
| While there is no universal standard for error codes, there are some
| broad conventions.  Three such conventions are mentioned below, for
| those who wish to make use of them.  The CodeIgniter defaults were
| chosen for the least overlap with these conventions, while still
| leaving room for others to be defined in future versions and user
| applications.
|
| The three main conventions used for determining exit status codes
| are as follows:
|
|    Standard C/C++ Library (stdlibc):
|       http://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
|       (This link also contains other GNU-specific conventions)
|    BSD sysexits.h:
|       http://www.gsp.com/cgi-bin/man.cgi?section=3&topic=sysexits
|    Bash scripting:
|       http://tldp.org/LDP/abs/html/exitcodes.html
|
*/
defined('EXIT_SUCCESS')        OR define('EXIT_SUCCESS', 0); // no errors
defined('EXIT_ERROR')          OR define('EXIT_ERROR', 1); // generic error
defined('EXIT_CONFIG')         OR define('EXIT_CONFIG', 3); // configuration error
defined('EXIT_UNKNOWN_FILE')   OR define('EXIT_UNKNOWN_FILE', 4); // file not found
defined('EXIT_UNKNOWN_CLASS')  OR define('EXIT_UNKNOWN_CLASS', 5); // unknown class
defined('EXIT_UNKNOWN_METHOD') OR define('EXIT_UNKNOWN_METHOD', 6); // unknown class member
defined('EXIT_USER_INPUT')     OR define('EXIT_USER_INPUT', 7); // invalid user input
defined('EXIT_DATABASE')       OR define('EXIT_DATABASE', 8); // database error
defined('EXIT__AUTO_MIN')      OR define('EXIT__AUTO_MIN', 9); // lowest automatically-assigned error code
defined('EXIT__AUTO_MAX')      OR define('EXIT__AUTO_MAX', 125); // highest automatically-assigned error code

/* SYS CONSTANT TO DEFINE SERVER HOST  */

//define('BSS_HOST', 'devbss.sytes.net');
//define('BSS_MP_TOKEN', 'APP_USR-8877359900700578-012401-353b1bedff98a4ab78a54ff57802f64a-1177407195');
//define('BSS_MP_CLIENT_ID', '8877359900700578');
//define('BSS_MP_CLIENT_SECRET', 'al5TAYSIdZPx2lzzU64DFgSX67SDrhsr');
//define('BSS_MP_WEBHOOK_SECRET', '54580656d5cde692cdb641e9b883db67cc992d2ac8d7e0b48babf7950d93664c');

//define('BSS_HOST', 'dev.bss.com.ar');
//define('BSS_MP_TOKEN', 'APP_USR-8877359900700578-012401-353b1bedff98a4ab78a54ff57802f64a-1177407195');
//define('BSS_MP_CLIENT_ID', '8877359900700578');
//define('BSS_MP_CLIENT_SECRET', 'al5TAYSIdZPx2lzzU64DFgSX67SDrhsr');
//define('BSS_MP_WEBHOOK_SECRET', '54580656d5cde692cdb641e9b883db67cc992d2ac8d7e0b48babf7950d93664c');

define('BSS_HOST', 'mi.bss.com.ar');
#define('BSS_HOST', 'sistema.bss.com.ar');
define('BSS_MP_TOKEN', 'APP_USR-7746070349246045-110411-3596c13de61863ab544a137c8387be8f-1469212359');
define('BSS_MP_CLIENT_ID', '7746070349246045');
define('BSS_MP_CLIENT_SECRET', 'eouwfrFfVjPNLbbrXs2iNmou5g17BGV6');
define('BSS_MP_WEBHOOK_SECRET', 'aec583f7ded6598f8548107537981444727d437588ba666e59396bde1e0039e5');
define('BSS_MP_WEBHOOK_SUBJECT', 'MercadoPago Webhook Notification MiBss');
define('MP_LOGO_BASE64', 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjMGEwMDgwIiBkPSJNMzIgMTUuMjcyYy0uMDMyLTUuNzM4LTcuMTYtMTAuMzU1LTE1Ljg5LTEwLjM1NWgtLjIwOGEyMi41IDIyLjUgMCAwIDAtOC4yNTggMS41NjVDMy4yMjcgOC4yNDcuMjEgMTEuMzc2IDAgMTQuOTY3djEuNjM2Yy4xNzIgMi44NTUgMS43MjEgNS40NTMgNC40MDUgNy4zNSAyLjkxIDIuMDU4IDYuODYxIDMuMTMgMTEuNDM0IDMuMTNoLjI0M2M0LjY5NC0uMDQgOC43MjMtMS4xOTggMTEuNjQ2LTMuMzQxIDIuNzgxLTIuMDQyIDQuMzAzLTQuODQgNC4yNzItNy44ODN6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE0LjQxOSAxOS43MzZxLjIxNy0uMDg1LjQ1LS4xMDJhMS4xNTMgMS4xNTMgMCAwIDEgLjg3NSAxLjk4NCAxLjE1IDEuMTUgMCAwIDEtLjg1Ni4zMiAxLjE0IDEuMTQgMCAwIDEtMS4xNS0xLjA4OGMwLS4yNjItLjE1My0uMzA1LS4yMzUtLjMwNWEuMzQuMzQgMCAwIDAtLjIxNS4xMS43OC43OCAwIDAgMS0uNTQ0LjI1NC45LjkgMCAwIDEtLjM2Ny0uMDc4LjgzNy44MzcgMCAwIDEtLjYyMi0uOTIuMjYuMjYgMCAwIDAtLjA1MS0uMjMuMy4zIDAgMCAwLS4xMy0uMDY3LjI3LjI3IDAgMCAwLS4yMS4wNjcgMS4xNCAxLjE0IDAgMCAxLS41NjguMjU4LjguOCAwIDAgMS0uMzA1LS4wNTUgMS4xOTcgMS4xOTcgMCAwIDEtLjgyNS0xLjM2MS4yMS4yMSAwIDAgMC0uMDctLjIyYy0uMTA2LS4wNjYtLjIwNC4wMzItLjI2Ny4wOTVhLjY1LjY1IDAgMCAxLS41NC4xNzYuOTcuOTcgMCAwIDEtLjktLjkxNi44NzYuODc2IDAgMCAxIC44Ny0uODg0LjguOCAwIDAgMSAuOTA3LjY2MS4yLjIgMCAwIDEgMCAuMDUxYzAgLjA3NC4wMjMuMTc2LjExNy4yMDcuMDk0LjAzMi4xNjQtLjA2Ni4yMDMtLjEyOWwuMDMyLS4wNDcuMDI3LS4wMzVhMS4wNSAxLjA1IDAgMCAxIC45OS0uNDM4cS4yIDAgLjM5MS4wNTlhLjkuOSAwIDAgMSAuNTg3Ljg5Mi4yMjcuMjI3IDAgMCAwIC4yMTUuMjIzLjI0LjI0IDAgMCAwIC4xOC0uMDkuOTcuOTcgMCAwIDEgLjY3Ny0uMzY0Yy4xNzIuMDAxLjM0My4wMzkuNS4xMS44MzguMzUyLjQ1OCAxLjQzMS40NTQgMS40MzktLjA1LjEyNS0uMTMzLjM0LjA0My40NTRoLjEwNmEuNi42IDAgMCAwIC4xODgtLjA0N3ptMTYuNzE3LTUuNzA0YTM2LjYgMzYuNiAwIDAgMC02LjU0OSAyLjE5NGMtMS41MTQtMS4yOTgtNS4wMTEtNC4zMDMtNS45NjItNC45OTFhNC4zIDQuMyAwIDAgMC0xLjI3MS0uNzI0IDIgMiAwIDAgMC0uNjM0LS4wOXEtLjQwMi4wMDgtLjc4Mi4xNDFhNi40IDYuNCAwIDAgMC0xLjgzNSAxLjE3NGwtLjAzNS4wM2E1IDUgMCAwIDEtMS41MTQuOTc1cS0uMjcyLjA2LS41NTIuMDYzYTEuNDMgMS40MyAwIDAgMS0uOTc0LS4yODZsLjA0My0uMDY3IDEuMzE5LTEuNDQzYzEuMDItMS4wNCAxLjk4My0yLjAxOSA0LjIxMy0yLjA4OWguMTFhNy44IDcuOCAwIDAgMSAyLjkzLjY5MiA5LjQgOS40IDAgMCAwIDQuMTE5LjkzMSAxMC42IDEwLjYgMCAwIDAgNC40LTEuMDcxYzEuNTUgMS4zMTQgMi42MDIgMi44NzkgMi45NzQgNC41NiIvPjxwYXRoIGZpbGw9IiMwMGJjZmYiIGQ9Ik0xNS45MjggNS42MzNoLjJhMjIuNiAyMi42IDAgMCAxIDYuMjE2Ljg1bC4xMzcuMDM4LjI3NC4wODNhMTYuNSAxNi41IDAgMCAxIDQuNjcgMi4zMDQgOS41IDkuNSAwIDAgMS0zLjY3My44MzNoLS4wNThhOC42IDguNiAwIDAgMS0zLjcwOS0uODc2IDguNyA4LjcgMCAwIDAtMy4yNzQtLjc0N2gtLjE3NmE1LjcyIDUuNzIgMCAwIDAtMy43MiAxLjM0NSA3LjcgNy43IDAgMCAwLTEuODQzLjM1NiA0LjcgNC43IDAgMCAxLTEuMjY0LjI1NGgtLjQ5MkEyNS4zIDI1LjMgMCAwIDEgNC42OTcgOC44N2MyLjg5MS0yLjAyMyA2Ljk1Ni0zLjIgMTEuMjMxLTMuMjM2Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTMuOTc2IDkuNDI0YzIuMDIzLjgxIDQuMzcgMS4zODUgNS4wODYgMS40MjRoLjE2Yy4xNiAwIC4zMjkuMDIuNDk3LjAyM2E1LjcgNS43IDAgMCAwIDEuNTE4LS4yNzdxLjI5Mi0uMDkuNTg2LS4xNmwtLjAyNy4wMjctMS4zNDIgMS40N2EuNzguNzggMCAwIDAtLjIuODU3Yy4wODguMTguMjIzLjMzMi4zOTIuNDM4LjQ1Ni4yNTQuOTcyLjM4IDEuNDk0LjM2OGEyLjYgMi42IDAgMCAwIC41OTEtLjA3Yy41ODMtLjEzMyAxLjE3NC0uNjE1IDEuODIzLTEuMTM1YTYgNiAwIDAgMSAxLjcxNy0xLjA1MnEuMjI2LS4wNjEuNDYyLS4wNjdoLjExN2EyLjYgMi42IDAgMCAxIDEuMjkxLjYwN2MxLjA2Ljc4MiA1LjU5IDQuNjk0IDYuMTE1IDUuMTI0YS44Ny44NyAwIDAgMSAuMjgxLjY0Ni42OC42OCAwIDAgMS0uMzYuNTcgMS4xIDEuMSAwIDAgMS0uNTkuMTkzIDEgMSAwIDAgMS0uNTAxLS4xMzdzLS4wNTktLjA1NS0uMTE0LS4xMzNhOTEgOTEgMCAwIDAtMi4yMTQtMS45NTYuNTUuNTUgMCAwIDAtLjM1Mi0uMTcyLjI2LjI2IDAgMCAwLS4yMDcuMDk3Yy0uMTE0LjE0NS0uMDU1LjM1Mi4xNTIuNTI0bDEuOTg4IDEuOTU3YS44NS44NSAwIDAgMSAuMjQyLjQ4LjgxLjgxIDAgMCAxLS40MTQuNzMyIDEuMTUgMS4xNSAwIDAgMS0uNjQyLjIyLjk2Ljk2IDAgMCAxLS41MDgtLjEzOGwtLjMwMi0uMjk3Yy0uNTE2LS40OTctMS4wNDgtMS4wMS0xLjQzNS0xLjMzYS42LjYgMCAwIDAtLjM1Ni0uMTcyLjI3LjI3IDAgMCAwLS4xOTYuMDg2Yy0uMDU1LjA2Ni0uMTI1LjIwMy4wMzUuMzkxcS4wNDYuMDY1LjEwNi4xMTdsMS40NDcgMS41OTdhLjQ0Ni40NDYgMCAwIDEgLjAzMi41NjNsLS4wNDMuMDYycS0uMDYyLjA2NS0uMTIyLjExOGMtLjE4NS4xMzgtLjQxLjIxLS42NDEuMjA3YTEgMSAwIDAgMS0uMTc2IDBjLS4xNi0uMDI3LS4yMTItLjA2Ni0uMjI3LS4wODZsLS4wNDctLjA0N3EtLjYxNS0uNjQzLTEuMjk1LTEuMjE2YS41Ny41NyAwIDAgMC0uMzQtLjE2NS4yNy4yNyAwIDAgMC0uMjA0LjA5Yy0uMTIxLjEzNy0uMDY2LjMzNy4xNDEuNTI0bDEuMDg4IDEuMjE3Yy0uMDI4LjA0LS4xNS4xNzItLjU2NC4yMjdxLS4wODMuMDA2LS4xNjQgMGEyLjYgMi42IDAgMCAxLTEuMDYtLjI5MyAxLjkzIDEuOTMgMCAwIDAtMS43NjQtMi42NDUgMS42OCAxLjY4IDAgMCAwLTEuMDA2LTEuNjk4IDIuMSAyLjEgMCAwIDAtLjc4Mi0uMTY4IDIgMiAwIDAgMC0uNTEzLjA4MmMtLjIwNi0uMzQzLS41My0uNi0uOTExLS43MjNhMS45IDEuOSAwIDAgMC0uNjg5LS4xMTQgMS44NSAxLjg1IDAgMCAwLTEuMDAxLjMwMSAxLjY1IDEuNjUgMCAwIDAtMS4yMTMtLjUzNiAxLjY3IDEuNjcgMCAwIDAtMS4wOTUuNDNjLS40NjItLjMyNC0yLjAyMy0xLjIzNi01LjkyNy0yLjA4OGEyMSAyMSAwIDAgMS0uODg0LS4yMzVjLjMyMS0xLjY3OCAxLjM5My0zLjI5OCAzLjA2Ny00LjY2Ii8+PHBhdGggZmlsbD0iIzAwYmNmZiIgZD0iTTMxLjI2OCAxNS45MDNjMCAuMTI5LS4wMjguMjU4LS4wNDQuMzkxLS4zNDQgMi4yMTgtMS44NTQgNC4zMDMtNC4zMzggNS45MDctMi44OCAxLjg4Ni02LjcxNyAyLjkzNC0xMC44MDUgMi45N2gtLjIwM2MtOC4zNCAwLTE1LjEzMS00LjMwNC0xNS4xNzQtOS42NDQgMC0uMTY4IDAtLjM1Mi4wMjMtLjU2bC44NDkuMTkzYzMuODUuODIxIDUuMjkzIDEuNjkgNS42NDkgMS45NTZhMS42NSAxLjY1IDAgMCAwIDEuNTUzIDIuMTk4cS4xMTEuMDA2LjIyMyAwYTEuOSAxLjkgMCAwIDAgMS4yMiAxLjMxOCAxLjU2IDEuNTYgMCAwIDAgLjg4LjA3OWMuMjA1LjQwNy41Ni43MTguOTkuODY4LjIwNi4wOC40MjUuMTIzLjY0Ni4xMjVxLjIxNC4wMDEuNDE4LS4wNjJhMS45MiAxLjkyIDAgMCAwIDEuNzM3IDEuMDk1Yy40OTQtLjAwNi45NjctLjIgMS4zMjItLjU0NC40NzIuMjU4Ljk5Ny40MDMgMS41MzQuNDI3aC4yNDZhMS41IDEuNSAwIDAgMCAxLjEwNy0uNTY0bC4wMzYtLjA0N3EuMjIuMDU0LjQ0Ni4wNTVhMS43OCAxLjc4IDAgMCAwIDEuMDU2LS4zOTFjLjI5Mi0uMjAzLjUwNi0uNS42MDYtLjg0MWguMjU0Yy4zODYtLjAwOS43Ni0uMTMxIDEuMDc2LS4zNTJhMS41NyAxLjU3IDAgMCAwIC43ODMtMS4yOTFxLjEyLjAxMi4yNDIgMGExLjg3IDEuODcgMCAwIDAgMS4wMTMtLjMyIDEuNDkgMS40OSAwIDAgMCAuNy0xLjE3NCAxLjU3IDEuNTcgMCAwIDAtLjE3NS0uODQyIDQwIDQwIDAgMCAxIDYuMTE0LTEuOTU2YzAgLjE2OS4wMzEuMzQuMDMxLjUxMyAwIC4xNzItLjAwNC4zMjktLjAxNi40OTMiLz48L3N2Zz4=');
