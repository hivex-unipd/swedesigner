package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedWhile extends ParsedInstruction {
	private String condition;
	private ParsedInstruction[] body;
	
	public ParsedWhile(String condition, ParsedInstruction[] body){
		this.condition = condition;
		this.body = body;
	}
	
	public String renderTemplate(Template t, String lang){
		ST template = t.getWhileTemplate();
		template.add("while", this);
		String body_string = "";
		if(body!=null){
			for(int i=0; i<body.length; i++){
			body_string+=body[i].renderTemplate(t, lang);
			}
		}
		
		template.add("body", (body_string==""?null:body_string));
		return template.render();
	}

	public String getCondition() {
		return condition;
	}

	public ParsedInstruction[] getBody() {
		return body;
	}
	
	public void setBody(ParsedInstruction[] pi){
		this.body = pi;
	} 

}
