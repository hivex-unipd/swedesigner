methodjavatemplate(method, body)::= <<
<method.visibility:initVis()><if(method.is_static)>static <endif><method.return_type> <method.name>(<method.args:attributejavatemplate(); separator=", ">)<if(method.body)>{
<body>
}<else>;<endif>;
>>