package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedAssignment extends ParsedInstruction {
	private String name;
	private String value;
	
	public ParsedAssignment(String name, String value){
		this.name = name;
		this.value = value;
	}
	
	public String renderTemplate(Template t, String lang){
		ST template = t.getAssignmentTemplate();
		template.add("assignment", this);
		return template.render();
	}

	public String getName() {
		return name;
	}
	
	public String getValue() {
		return value;
	}

}
