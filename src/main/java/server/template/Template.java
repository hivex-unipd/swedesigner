package server.template;

import org.stringtemplate.v4.ST;

public interface Template {
	public ST getAttributeTemplate();

	public ST getAssignmentTemplate();

	public ST getInitializationTemplate();

	public ST getForTemplate();

	public ST getIfTemplate();

	public ST getReturnTemplate();

	public ST getClassTemplate();

	public ST getMethodTemplate();

	public ST getWhileTemplate();

	public ST getInterfaceTemplate();
}
