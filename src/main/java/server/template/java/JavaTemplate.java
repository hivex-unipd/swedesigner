package server.template.java;

import org.springframework.stereotype.Component;
import org.stringtemplate.v4.*;

import server.template.Template;

/**
 * A {@code JavaTemplate} is a factory object
 * for obtaining templates for translating a
 * specific {@code ParsedElement} object into
 * a Java source code string.
 */
public class JavaTemplate implements Template {

	private STGroup group = new STGroupDir("templates");

	@Override
	public ST getAttributeTemplate() {
		return group.getInstanceOf("attributejavatemplate");
	}

	@Override
	public ST getForTemplate() {
		return group.getInstanceOf("forjavatemplate");
	}

	@Override
	public ST getIfTemplate() {
		return group.getInstanceOf("ifjavatemplate");
	}

	@Override
	public ST getReturnTemplate() {
		return group.getInstanceOf("returnjavatemplate");
	}

	@Override
	public ST getClassTemplate() {
		return group.getInstanceOf("classjavatemplate");
	}

	@Override
	public ST getMethodTemplate() {
		return group.getInstanceOf("methodjavatemplate");
	}

	@Override
	public ST getWhileTemplate() {
		return group.getInstanceOf("whilejavatemplate");
	}

	@Override
	public ST getInterfaceTemplate() {
		return group.getInstanceOf("interfacejavatemplate");
	}

	@Override
	public ST getElseTemplate() {
		return group.getInstanceOf("elsejavatemplate");
	}

	@Override
	public ST getStatementTemplate() {
		return group.getInstanceOf("statementjavatemplate");
	}
}
