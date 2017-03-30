package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedIf extends ParsedInstruction {
	private String condition;
	private ParsedInstruction[] ifbody;
	private ParsedInstruction[] elsebody;
	
	public ParsedIf(String condition, ParsedInstruction[] ifbody, ParsedInstruction[] elsebody){
		this.condition = condition;
		this.ifbody = ifbody;
		this.elsebody = elsebody;
	}
	
	public String renderTemplate(Template t) {
		ST template = t.getIfTemplate();
		String ifbody_string ="";
		if(ifbody!=null){
			for(int i=0; i<ifbody.length; i++){
			ifbody_string += ifbody[i].renderTemplate(t);
			}
		}
		
		String elsebody_string ="";
		if(elsebody!=null){
			for(int i=0; i<elsebody.length; i++){
		elsebody_string += elsebody[i].renderTemplate(t);
			}
		}
		template.add("if1", this);
		template.add("ifbody", (ifbody_string==""?null:ifbody_string));
		template.add("elsebody", (elsebody_string==""?null:elsebody_string));
		return template.render();
	}

	public String getCondition() {
		return condition;
	}

	public ParsedInstruction[] getIfbody() {
		return ifbody;
	}

	public ParsedInstruction[] getElsebody() {
		return elsebody;
	}
	
	public void setBody(ParsedInstruction[] pi){
		this.ifbody = pi;
	} 

}
