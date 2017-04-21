package server.project;

import java.util.List;

/**
 * A {@code ParsedInstruction} object represents
 * an instruction declared inside a {@code ParsedMethod}.
 */
public abstract class ParsedInstruction implements ParsedElement {
	public void setBody(List<ParsedInstruction> parsedInstructions) {}
}
