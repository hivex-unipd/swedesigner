interfacejavatemplate(interface, methods)::=<<
<interface.visibility:initVis()>interface <interface.name><if(interface.extended)> extends <interface.extended:{e|<e>}; separator=", "><endif>{
<interface.attributes:initjavatemplate(); separator="\n">
<methods>
};
>>