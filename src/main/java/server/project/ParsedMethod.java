package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.check.Check;
import server.template.Template;

public class ParsedMethod implements ParsedElement {
	private String visibility;
	private boolean is_static;
	private boolean is_abstract;
	private String return_type;
	private String name;
	private List<ParsedAttribute> args;
	private List<ParsedInstruction> body;
	
	//costruttore
	public ParsedMethod(String visibility, boolean is_static, boolean is_abstract, String return_type, String name, List<ParsedAttribute> args, List<ParsedInstruction> body){
		this.visibility = visibility;
		this.is_static = is_static;
		this.is_abstract = is_abstract;
		this.return_type = return_type;
		this.name = name;
		this.args = args;
		this.body = body;
	}
	
	public String renderTemplate(Template t) {
		ST template = t.getMethodTemplate();
		template.add("method", this); 
		String body_string = null;
		if(body!=null)
			body_string = "";
			for(int i=0; i<body.size(); i++){
				body_string += body.get(i).renderTemplate(t);
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
	
	public boolean getIs_abstract() {
		return is_abstract;
	}
	
	public String getReturn_type() {
		return return_type;
	}
	
	public String getName(){
		return name;
	}
	public List<ParsedAttribute> getArgs() {
		return args;
	}
	
	public List<ParsedInstruction> getBody() {
		return body;
	}
}
