<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class SearchingInfo extends Controller
{
    public function sessionyear(Request $request)
    {
        $session_year = DB::select('select session_year from mis_session_year');
        return response($session_year);
    }

    public function session(Request $request)
    {
        $session = DB::select('select session from mis_session');
        return response($session);
    }

    public function department(Request $request)
    {
        $department = DB::select('select id,name from departments where type = "academic"');
        return response($department);
    }

    public function course(Request $request)
    {
        $course = DB::select("select distinct id,name
            from cs_courses
            inner join course_branch on course_branch.course_id = cs_courses.id
            inner join dept_course on dept_course.course_branch_id = course_branch.course_branch_id
            where dept_course.dept_id ='$request->deptid'");
        return response($course);
    }

    public function branch(Request $request)
    {
        $deptid=$request->deptid;
        $courseid=$request->courseid;
        $branch = DB::select("SELECT DISTINCT cs_branches.id,cs_branches.name
            FROM cs_branches
            INNER JOIN course_branch ON course_branch.branch_id = cs_branches.id
            INNER JOIN dept_course ON dept_course.course_branch_id = course_branch.course_branch_id
            JOIN departments d ON d.id=dept_course.dept_id
            WHERE dept_course.dept_id='$deptid' AND course_branch.course_id = '$courseid' AND cs_branches.id!='ap'
            ORDER BY dept_course.dept_id,cs_branches.name");
        return response($branch);
    }
}
