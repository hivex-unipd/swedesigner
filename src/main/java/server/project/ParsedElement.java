package server.project;

import server.template.Template;

/**
 * A {@code ParsedElement} object represents
 * any part of a {@code ParsedProgram} which
 * can be translated to a string of source code.
 */
public interface ParsedElement {
	String renderTemplate(Template template);
}
