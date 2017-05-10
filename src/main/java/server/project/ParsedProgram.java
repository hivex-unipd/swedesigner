package server.project;

import java.util.ArrayList;
import java.util.List;

/**
 * A {@code ParsedProgram} object represents a
 * set of {@code ParsedType}s interacting with
 * one another to form a software program.
 */
public class ParsedProgram {
	private List<ParsedType> classes = new ArrayList<ParsedType>();

	public void addType(ParsedType type) {
		classes.add(type);
	}

	public int numberClasses() {
		return classes.size();
	}

	public ParsedType getType(int position) {
		return classes.get(position);
	}
}
