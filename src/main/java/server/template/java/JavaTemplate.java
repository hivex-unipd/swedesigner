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

	/**
	 * Returns a ST template for generating Java class
	 * members (attributes).
	 * @return a template for attributes
	 */
	@Override
	public ST getAttributeTemplate() {
		return group.getInstanceOf("attributejavatemplate");
	}

	/**
	 * Returns a ST template for generating Java "for"
	 * loops.
	 * @return a template for "for" loops
	 */
	@Override
	public ST getForTemplate() {
		return group.getInstanceOf("forjavatemplate");
	}

	/**
	 * Returns a ST template for generating Java 
	 * conditional statements.
	 * @return a template for conditional statements
	 */
	@Override
	public ST getIfTemplate() {
		return group.getInstanceOf("ifjavatemplate");
	}

	/**
	 * Returns a ST template for generating Java return
	 * statements
	 * @return a template for return statements
	 */
	@Override
	public ST getReturnTemplate() {
		return group.getInstanceOf("returnjavatemplate");
	}

	/**
	 * Returns a ST template for generating Java classes.
	 * @return a template for classes
	 */
	@Override
	public ST getClassTemplate() {
		return group.getInstanceOf("classjavatemplate");
	}

	/**
	 * Returns a ST template for generating Java methods.
	 * @return a template for methods
	 */
	@Override
	public ST getMethodTemplate() {
		return group.getInstanceOf("methodjavatemplate");
	}

	/**
	 * Returns a ST template for generating Java "while"
	 * loops.
	 * @return a template for "while" loops
	 */
	@Override
	public ST getWhileTemplate() {
		return group.getInstanceOf("whilejavatemplate");
	}

	/**
	 * Returns a ST template for generating Java interfaces.
	 * @return a template for interfaces
	 */
	@Override
	public ST getInterfaceTemplate() {
		return group.getInstanceOf("interfacejavatemplate");
	}

	/**
	 * Returns a ST template for generating Java alternative
	 * conditional statements.
	 * @return a template for alternative conditional statements
	 */
	@Override
	public ST getElseTemplate() {
		return group.getInstanceOf("elsejavatemplate");
	}

	/**
	 * Returns a ST template for generating Java statements.
	 * @return a template for statements
	 */
	@Override
	public ST getStatementTemplate() {
		return group.getInstanceOf("statementjavatemplate");
	}
}
