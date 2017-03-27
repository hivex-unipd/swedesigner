methodjavatemplate(method, args, body)::= <<
<method.visibility:initVis()> <if(method.is_static)>static<endif> <method.return_type> <method.name>(<args>){
<body>
}
>>