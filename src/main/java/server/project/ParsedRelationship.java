package server.project;

import server.template.Template;

public class ParsedRelationship implements ParsedElement {
	private enum Type{
		EXTENDS, IMPLEMENTS, REFERENCE
	}
	private String other_class;
	private Type type;
	private int min, max;
	@Override
	public String renderTemplate(Template t, String lang) {
		// TODO Auto-generated method stub
		return null;
	}

}
