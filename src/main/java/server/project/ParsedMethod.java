package server.project;

import java.util.List;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedMethod implements ParsedElement {
	private String visibility;
	private boolean isStatic;
	private boolean isAbstract;
	private String returnType;
	private String name;
	private List<ParsedAttribute> args;
	private List<ParsedInstruction> body;
	
	//costruttore
	public ParsedMethod(String visibility, boolean isStatic, boolean isAbstract, String returnType, String name, List<ParsedAttribute> args, List<ParsedInstruction> body){
		this.visibility = visibility;
		this.isStatic = isStatic;
		this.isAbstract = isAbstract;
		this.returnType = returnType;
		this.name = name;
		this.args = args;
		this.body = body;
	}
	
	public String renderTemplate(Template template) {
		ST STtemplate = template.getMethodTemplate();
		STtemplate.add("method", this); 
		String bodyString = null;
		if(body!=null){
			bodyString = "";
			for(int i=0; i<body.size(); i++){
				bodyString += body.get(i).renderTemplate(template);
			}
		}	
		STtemplate.add("body", bodyString);
		return STtemplate.render();
	}
	
	public String getVisibility() {
		return visibility;
	}
	
	public boolean getIsStatic() {
		return isStatic;
	}
	
	public boolean getIsAbstract() {
		return isAbstract;
	}
	
	public String getReturnType() {
		return returnType;
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
