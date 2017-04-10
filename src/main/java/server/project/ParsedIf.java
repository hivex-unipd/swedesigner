package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedIf extends ParsedInstruction {
	private String condition;
	private List<ParsedInstruction> body;
	
	
	public ParsedIf(String condition, List<ParsedInstruction> body){
		this.condition = condition;
		this.body = body;
	}
	
	public String renderTemplate(Template t) {
		ST template = t.getIfTemplate();
		String bodyString ="";
		if(body!=null){
			for(int i=0; i<body.size(); i++){
			bodyString += body.get(i).renderTemplate(t);
			}
		}
		
		template.add("if1", this);
		template.add("body", (bodyString.equals("")?null:bodyString));
		return template.render();
	}

	public String getCondition() {
		return condition;
	}

	public List<ParsedInstruction> getBody() {
		return body;
	}

}
