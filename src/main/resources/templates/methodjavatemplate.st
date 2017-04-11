methodjavatemplate(method, body)::= <<
<if(method.isAbstract)>abstract <endif><method.visibility:initVis()><if(method.isStatic)>static <endif><method.returnType> <method.name>(<method.args:attributejavatemplate(); separator=", ">)<if(method.body)> {
<body>
}<else>;<endif>
>>
