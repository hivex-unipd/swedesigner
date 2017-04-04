package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.check.Check;
import server.template.Template;

public class ParsedIf extends ParsedInstruction {
	private String condition;
	private List<ParsedInstruction> ifbody;
	
	
	public ParsedIf(String condition, List<ParsedInstruction> ifbody){
		this.condition = condition;
		this.ifbody = ifbody;
	}
	
	public String renderTemplate(Template t) {
		ST template = t.getIfTemplate();
		String ifbody_string ="";
		if(ifbody!=null){
			for(int i=0; i<ifbody.size(); i++){
			ifbody_string += ifbody.get(i).renderTemplate(t);
			}
		}
		
		template.add("if1", this);
		template.add("ifbody", (ifbody_string==""?null:ifbody_string));
		return template.render();
	}

	public String getCondition() {
		return condition;
	}

	public List<ParsedInstruction> getIfbody() {
		return ifbody;
	}

}
