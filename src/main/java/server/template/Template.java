package server.template;

import org.stringtemplate.v4.ST;

/**
 * A {@code Template} is a factory object
 * for obtaining templates for translating a
 * specific {@code ParsedElement} object into
 * a source code string.
 */
public interface Template {

	/**
	 * Returns a ST template for generating class
	 * members (attributes).
	 * @return a template for attributes
	 */
	ST getAttributeTemplate();

	/**
	 * Returns a ST template for generating "for"
	 * loops.
	 * @return a template for "for" loops
	 */
	ST getForTemplate();

	/**
	 * Returns a ST template for generating 
	 * conditional statements.
	 * @return a template for conditional statements
	 */
	ST getIfTemplate();

	/**
	 * Returns a ST template for generating return
	 * statements
	 * @return a template for return statements
	 */
	ST getReturnTemplate();

	/**
	 * Returns a ST template for generating classes.
	 * @return a template for classes
	 */
	ST getClassTemplate();

	/**
	 * Returns a ST template for generating methods.
	 * @return a template for methods
	 */
	ST getMethodTemplate();

	/**
	 * Returns a ST template for generating "while"
	 * loops.
	 * @return a template for "while" loops
	 */
	ST getWhileTemplate();

	/**
	 * Returns a ST template for generating interfaces.
	 * @return a template for interfaces
	 */
	ST getInterfaceTemplate();

	/**
	 * Returns a ST template for generating alternative
	 * conditional statements.
	 * @return a template for alternative conditional statements
	 */
	ST getElseTemplate();

	/**
	 * Returns a ST template for generating statements.
	 * @return a template for statements
	 */
	ST getStatementTemplate();
}
