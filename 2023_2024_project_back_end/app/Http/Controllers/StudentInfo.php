<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentInfo extends Controller
{
    public function info(Request $request)
    {
        $form_id = DB::select("select form_id
            from reg_regular_form 
            where session_year='$request->session_year'
            and session='$request->session'
            and admn_no='$request->admn_no'");
            
        if($request->formid=='') $form_id=$form_id[0]->{'form_id'};
        else $form_id=$request->formid;

        $general_info = DB::select("SELECT distinct reg_regular_form.admn_no as admn_no,
                departments.id as deptid,departments.name as department,
                cbcs_courses.id as coureid,cbcs_courses.name as course,
                cbcs_branches.id as branchid,cbcs_branches.name as branch,
                session_year,
                session,
                reg_regular_form.status as status
            FROM (dept_course
                join course_branch on course_branch.course_branch_id=dept_course.course_branch_id
                join departments on dept_course.dept_id=departments.id
                join cbcs_courses on cbcs_courses.id=course_branch.course_id
                join cbcs_branches on cbcs_branches.id=course_branch.branch_id)
            right join reg_regular_form on reg_regular_form.branch_id=course_branch.branch_id 
                and reg_regular_form.course_id=course_branch.course_id
            where session_year='$request->session_year'
                and session='$request->session'
                and admn_no='$request->admn_no'");
        
        $course_info = DB::select("select subject_code,subject_name,sub_category,remark2 as status
            from pre_stu_course 
            where form_id='$form_id'
            ORDER BY priority");
        
        $fee_info = DB::select("select fee_amt,transaction_id,fee_date,receipt_path 
            from reg_regular_fee 
            where form_id='$form_id'");
        
        return response([$general_info,$course_info,$fee_info,$form_id]);
    }

    public function bulkinfo(Request $request)
    {
        $b1=1;$b2=1;$b3=1;$b4=1;
        if($request->deptid!='')$b1=0;
        if($request->courseid!='')$b2=0;
        if($request->branchid!='')$b3=0;
        if($request->semester!='')$b4=0;
        $students = DB::select("SELECT distinct reg_regular_form.form_id as form_id,
            reg_regular_form.admn_no as admn_no,
            reg_regular_form.semester as semester,
            dept_course.dept_id as deptid,
            course_branch.course_id as courseid,
            course_branch.branch_id as branchid,
            reg_regular_fee.fee_amt,
            reg_regular_fee.transaction_id,
            reg_regular_fee.receipt_path,
            reg_regular_fee.fee_date
            FROM course_branch
            join dept_course on dept_course.course_branch_id=course_branch.course_branch_id
            right join reg_regular_form on MIS.reg_regular_form.course_id=course_branch.course_id 
                and reg_regular_form.branch_id=course_branch.branch_id
            join reg_regular_fee on reg_regular_fee.form_id=reg_regular_form.form_id
            where reg_regular_form.session_year='$request->session_year'
            and reg_regular_form.session='$request->session'
            and ( $b1 or dept_course.dept_id='$request->deptid')
            and ( $b2 or reg_regular_form.course_id='$request->courseid')
            and ( $b3 or reg_regular_form.branch_id='$request->branchid')
            and ( $b4 or reg_regular_form.semester='$request->semester')
            and reg_regular_form.status= '$request->status'");
        return response($students);
    }
}
