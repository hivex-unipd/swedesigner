package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

/**
 * A {@code ParsedAttribute} object represents a
 * class member, i.e. an field of a {@code ParsedType}.
 */
public class ParsedAttribute implements ParsedElement {
	private boolean isStatic;
	private String visibility;
	private String type;
	private String name;
	private String operation;
	private String value;
	private boolean isFinal = false;

	public ParsedAttribute(boolean isStatic, String visibility, String type, String name, String operation, String value) {
		this.isStatic = isStatic;
		this.visibility = visibility;
		this.type = type;
		this.name = name;
		this.operation = operation;
		this.value = value;
			
		if (name.equals(name.toUpperCase()))
			isFinal = true;
	}

	public String getVisibility() {return visibility;}
	public String getType() {return type;}
	public String getName() {return name;}
	public String getValue() {return value;}
	public String getOperation() {return operation;}
	public boolean getIsStatic() {return isStatic;}
	public boolean getIsFinal() {return isFinal;}

	@Override
	public String renderTemplate(Template t) {
		ST template = t.getAttributeTemplate();
		template.add("att", this);
		return template.render();
	}
}
