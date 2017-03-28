classjavatemplate(class, methods)::=<<
<class.visibility:initVis()>class <class.name><if(class.extended)> extends <class.extended:{e|<e>}; separator=", "><endif><if(class.implemented)>, implements <class.implemented:{im|<im>}; separator=", "><endif>{
<class.attributes:initjavatemplate(); separator="\n">
<methods>
};
>>