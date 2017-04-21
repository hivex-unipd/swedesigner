package server.template;

import org.stringtemplate.v4.ST;

/**
 * A {@code Template} is a factory object
 * for obtaining templates for translating a
 * specific {@code ParsedElement} object into
 * a source code string.
 */
public interface Template {
	ST getAttributeTemplate();
	ST getForTemplate();
	ST getIfTemplate();
	ST getReturnTemplate();
	ST getClassTemplate();
	ST getMethodTemplate();
	ST getWhileTemplate();
	ST getInterfaceTemplate();
	ST getElseTemplate();
	ST getStatementTemplate();
}
