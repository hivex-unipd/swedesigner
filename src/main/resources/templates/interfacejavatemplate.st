interfacejavatemplate(interface, methods)::=<<
public interface <interface.name><if(interface.extended)> extends <interface.extended:{e|<e>}; separator=", "><endif>{
	<interface.attributes:attributejavatemplate(); separator="\n">
	<methods>
}
>>