package server.stereotype;

import java.util.List;
import java.util.ArrayList;

/**
 * A {@code Stereotype} object represents a
 * custom kind of type for modeling a class
 * of types when designing a program.
 */
public class Stereotype {

	private List<String> metaAttributes;
	private List<String> metaMethods;

	/**
	 * Constructor for a stereotype.
	 * @param  path where the stereotype is located
	 */
	public Stereotype(String path) {
		metaAttributes = new ArrayList<String>();
		metaMethods = new ArrayList<String>();
	}

	/**
	 * Returns the meta-attributes of the stereotype.
	 * @return the meta-attributes
	 */
	public String getMetaAttributes() {
		return null;
	}

	/**
	 * Returns the meta-methods of the stereotype.
	 * @return the meta-methods
	 */
	public String getMetaMethods() {
		return null;
	}
}
