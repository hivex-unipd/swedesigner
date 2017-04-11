package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedElse extends ParsedInstruction {
	private List<ParsedInstruction> body;
	
	public ParsedElse(List<ParsedInstruction> body){
		this.body = body;
	}

	@Override
	public String renderTemplate(Template template) {
		ST STtemplate = template.getElseTemplate();
		
		String bodyString ="";
		if(body!=null){
			for(int i=0; i<body.size(); i++){
				bodyString += body.get(i).renderTemplate(template);
			}
		}
		STtemplate.add("body", bodyString);
		return STtemplate.render();
	}
	
	public List<ParsedInstruction> getBody() {
		return body;
	}
	
	public void setBody(List<ParsedInstruction> parsedInstructions){
		this.body = parsedInstructions;
	}

}
