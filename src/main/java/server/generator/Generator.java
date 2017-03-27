package server.generator;

import server.project.ParsedProgram;

public interface Generator {
	public abstract void generate(String IdReq, ParsedProgram p);
}
