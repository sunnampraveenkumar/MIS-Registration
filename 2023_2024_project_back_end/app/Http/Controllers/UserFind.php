<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class UserFind extends Controller
{
    public function find(Request $requet){
        $user = DB::select('select * from user');
        return response(['data' => $user]);
    }
}
