package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.check.Check;
import server.template.Template;

public class ParsedWhile extends ParsedInstruction {
	private String condition;
	private List<ParsedInstruction> body;
	
	public ParsedWhile(String condition, List<ParsedInstruction> body){
		this.condition = condition;
		this.body = body;
	}
	
	public String renderTemplate(Template t) {
		ST template = t.getWhileTemplate();
		template.add("while", this);
		String body_string = "";
		if(body!=null){
			for(int i=0; i<body.size(); i++){
			body_string+=body.get(i).renderTemplate(t);
			}
		}
		
		template.add("body", (body_string==""?null:body_string));
		return template.render();
	}

	public String getCondition() {
		return condition;
	}

	public List<ParsedInstruction> getBody() {
		return body;
	}
	
	public void setBody(List<ParsedInstruction> pi){
		this.body = pi;
	}

}
