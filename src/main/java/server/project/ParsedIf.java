package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.check.Check;
import server.template.Template;

public class ParsedIf extends ParsedInstruction {
	private String condition;
	private List<ParsedInstruction> ifbody;
	private List<ParsedInstruction> elsebody;
	
	public ParsedIf(String condition, List<ParsedInstruction> ifbody, List<ParsedInstruction> elsebody){
		this.condition = condition;
		this.ifbody = ifbody;
		this.elsebody = elsebody;
	}
	
	public String renderTemplate(Template t) {
		ST template = t.getIfTemplate();
		String ifbody_string ="";
		if(ifbody!=null){
			for(int i=0; i<ifbody.size(); i++){
			ifbody_string += ifbody.get(i).renderTemplate(t);
			}
		}
		
		String elsebody_string ="";
		if(elsebody!=null){
			for(int i=0; i<elsebody.size(); i++){
		elsebody_string += elsebody.get(i).renderTemplate(t);
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

	public List<ParsedInstruction> getIfbody() {
		return ifbody;
	}

	public List<ParsedInstruction> getElsebody() {
		return elsebody;
	}
	
	public void setBody(List<ParsedInstruction> pi){
		this.ifbody = pi;
	}

}
