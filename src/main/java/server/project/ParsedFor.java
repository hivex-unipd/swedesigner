package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedFor extends ParsedInstruction {
	private ParsedInitialization init;
	private String condition;
	private ParsedAssignment step;
	private ParsedInstruction[] body;
	
	public ParsedFor(ParsedInitialization init, String condition, ParsedAssignment step, ParsedInstruction[] body){
		this.init = init;
		this.condition = condition;
		this.step = step;
		this.body = body;
		
	}
	
	public String renderTemplate(Template t, String lang){
		ST template = t.getForTemplate();
		String body_string ="";
		if(body!=null){
			for(int i=0; i<body.length; i++){
			body_string += body[i].renderTemplate(t, lang);
			}
		}
		
		template.add("for", this);
		template.add("body", (body_string==""?null:body_string));
		return template.render();
		}

	public ParsedInstruction getInit() {
		return init;
	}

	public String getCondition() {
		return condition;
	}


	public ParsedAssignment getStep() {
		return step;
	}

	public ParsedInstruction[] getBody() {
		return body;
	}

}
