package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

import java.util.Set;
import java.util.HashSet;
import java.util.Arrays;

/**
 * A {@code ParsedStatement} object is a
 * {@code ParsedInstruction} representing an
 * action to be performed on a specific variable.
 */
public class ParsedStatement extends ParsedInstruction {
	private String type;
	private String name;
	private String operation;
	private String value;

	private Set<String> spacedOperations = new HashSet<String>(Arrays.asList("=", "+", "-", "*", "/", "+=", "-=", "*=", "/="));

	public ParsedStatement(String type, String name, String operation, String value) { 
		this.type = type;
		this.name = name;
		if (spacedOperations.contains(operation))
			this.operation = " " + operation + " ";
		else
			this.operation = operation;
		this.value = value;
	}

	public String getType() {return type;}
	public String getName() {return name;}
	public String getOperation() {return operation;}
	public String getValue() {return value;}

	@Override
	public String renderTemplate(Template template) {
		ST STtemplate = template.getStatementTemplate();
		STtemplate.add("att", this);
		return STtemplate.render();
	}
}
