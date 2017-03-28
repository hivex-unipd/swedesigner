package server.project;

import server.template.Template;

public interface ParsedElement {
	public abstract String renderTemplate(Template t, String lang);
}
