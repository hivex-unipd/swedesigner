package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedClass extends ParsedType {
	private String name;
	private String visibility;
	private String[] extended;
	private String[] implemented;
	//private String[] referenced;
	private ParsedAttribute[] attributes;
	private ParsedMethod[] methods;
	
	public ParsedClass(String name, String visibility, String[] extended, String[] implemented, ParsedAttribute[] attributes, ParsedMethod[] methods){
		this.name = name;
		this.visibility = visibility;
		this.extended = extended;
		this.implemented =implemented;
		this.attributes = attributes;
		this.methods = methods;
	}
	
	//metodi getter
	 public String getVisibility(){ return visibility;}
	 public String getName(){return name;}
	 public String[] getExtended(){return extended;}
	 public String[] getImplemented(){return implemented;}
	 public ParsedAttribute[] getAttributes(){return attributes;}
	 public ParsedMethod[] getMethods(){return methods;}
	
	public String renderTemplate(Template t, String lang){
		ST template = t.getClassTemplate();
		template.add("class", this);
		String methods_string = "";
		for(int i=0; i<methods.length; i++){
			methods_string += methods[i].renderTemplate(t, "java");
		}
		template.add("methods", methods_string);
		return template.render();
	}
}
