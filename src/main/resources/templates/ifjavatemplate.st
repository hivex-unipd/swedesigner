ifjavatemplate(if1, ifbody, elsebody)::=<<
if(<if1.condition>){
	<ifbody>
	}<if(elsebody)>else{
	<elsebody>	
}<endif>
>>