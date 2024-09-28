<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SearchingInfo;
use App\Http\Controllers\StudentInfo;
use App\Http\Controllers\StudentVerify;
/*
|--------------------------------------------------------------------------
| API Routes by @bhijeet
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loadeds by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::fallback(function () {
    return response()->json([
        'status' => false,
        'message' => 'Invalid Route !!',
    ], 200);
});

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('validateuser', 'validateUser');
    
    Route::post('login_api', 'login_api');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::get('refresh', 'refresh');
    Route::post('update_password', 'UpdatePassword');
    Route::post('un-block-user', 'unBlockUser');
    Route::get('TokenError', 'TokenError')->name('TokenError');
    Route::get('get-unread-notification', 'getUnReadNotification');
    Route::get('get-read-notification', 'getReadNotification');
    Route::post('mark-read-notification', 'markReadNotification');
    Route::post('GetBiometicAttendance', 'GetBiometicAttendance');
});

// here add routes Module wise

Route::controller(StudentInfo::class)->group(function () {
    Route::post('info', 'info');
    Route::post('bulkinfo', 'bulkinfo');
});

Route::controller(SearchingInfo::class)->group(function () {
    Route::get('session_year', 'sessionyear');
    Route::get('session', 'session');
    Route::get('department', 'department');
    Route::post('course', 'course');
    Route::post('branch', 'branch');
});

Route::controller(StudentVerify::class)->group(function () {
    Route::post('verify', 'verify');
});

include('adminRoutes.php');
include('userRoutes.php');



