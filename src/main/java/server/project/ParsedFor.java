package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedFor extends ParsedInstruction {
	private String init;
	private String condition;
	private String step;
	private ParsedInstruction[] body;
	
	public ParsedFor(String init, String condition, String step, ParsedInstruction[] body){
		this.init = init;
		this.condition = condition;
		this.step = step;
		this.body = body;
		
	}
	
	public String renderTemplate(Template t) {
		ST template = t.getForTemplate();
		String body_string ="";
		if(body!=null){
			for(int i=0; i<body.length; i++){
			body_string += body[i].renderTemplate(t);
			}
		}
		
		template.add("for", this);
		template.add("body", (body_string==""?null:body_string));
		return template.render();
		}

	public String getInit() {
		return init;
	}

	public String getCondition() {
		return condition;
	}


	public String getStep() {
		return step;
	}

	public ParsedInstruction[] getBody() {
		return body;
	}
	
	public void setBody(ParsedInstruction[] pi){
		this.body = pi;
	} 

}
