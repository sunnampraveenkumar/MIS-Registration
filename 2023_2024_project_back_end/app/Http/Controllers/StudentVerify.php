<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class StudentVerify extends ControllerAPI
{
    public function __construct()
    {
        parent::__construct();
        $this->middleware('AuthCheck:stu,emp', ['except' => ['login', 'validateUser', 'refresh', 'gen_menu', 'TokenError', 'sanctum/csrf-cookie']]);
    }

    public function verify(Request $request)
    {
        $form_id=$request->form_id;
        $admn_no=$request->admn_no;
        $id=Auth::user()->id;
        $time = Carbon::now('Asia/Kolkata')->toDateTimeString();
        $verify="verified|$id|$time";
        
        // DB::beginTransaction();
        // DB::update("UPDATE reg_regular_form SET status = '0',re_id='' WHERE form_id = '$form_id';");
        // DB::update("UPDATE stu_academic SET semester = semester-1 WHERE admn_no  = '$admn_no';");
        // DB::delete("DELETE FROM cbcs_stu_course where form_id='$form_id';");
        // DB::update("UPDATE pre_stu_course SET remark2 ='1',course_aggr_id = 'b.tech_cse_2023-2024',updated_at = '$time' WHERE remark2 = '3' and form_id= '$form_id';");
        // DB::commit();

        DB::beginTransaction();
        DB::update("UPDATE reg_regular_form SET status = '1',re_id='$verify'  WHERE form_id = '$form_id';");
        DB::update("UPDATE stu_academic SET semester = semester+1 WHERE admn_no  = '$admn_no';");
        DB::insert("INSERT INTO MIS.cbcs_stu_course(form_id,admn_no,sub_offered_id,subject_code,course_aggr_id,subject_name,priority,sub_category,map_id,sub_category_cbcs_offered,course,branch,session_year,session)
                    SELECT form_id,admn_no,SUBSTRING(sub_offered_id,2,50),subject_code,course_aggr_id,subject_name,priority,sub_category,map_id,sub_category_cbcs_offered,course,branch,session_year,session
                    FROM pre_stu_course
                    where remark2='1' and form_id='$form_id';");
        DB::update("UPDATE pre_stu_course SET remark2 ='3',course_aggr_id = '$verify',updated_at = '$time' WHERE remark2 = '1' and form_id= '$form_id';");
        DB::commit();

        return response([$form_id,$admn_no,$verify]);
    }
}