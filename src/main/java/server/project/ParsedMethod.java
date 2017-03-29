package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedMethod implements ParsedElement {
	private String visibility;
	private boolean is_static;
	private String return_type;
	private String name;
	private ParsedAttribute[] args;
	private List<ParsedInstruction> body;
	
	//costruttore
	public ParsedMethod(String visibility, boolean is_static, String return_type, String name, ParsedAttribute[] args, List<ParsedInstruction> body){
		this.visibility = visibility;
		this.is_static = is_static;
		this.return_type = return_type;
		this.name = name;
		this.args = args;
		this.body = body;
	}
	
	public String renderTemplate(Template t, String lang){
		ST template = t.getMethodTemplate();
		template.add("method", this); 
		String body_string = "";
		for(int i=0; i<body.size(); i++){
			body_string += body.get(i).renderTemplate(t, lang);
		}
		template.add("body", body_string);
		return template.render();
	}
	
	public String getVisibility() {
		return visibility;
	}
	
	public boolean getIs_static() {
		return is_static;
	}
	
	public String getReturn_type() {
		return return_type;
	}
	
	public String getName(){
		return name;
	}
	public ParsedAttribute[] getArgs() {
		return args;
	}
	
	public List<ParsedInstruction> getBody() {
		return body;
	}
}
