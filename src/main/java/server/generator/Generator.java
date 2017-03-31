package server.generator;

import java.io.FileNotFoundException;

import server.project.ParsedProgram;

public interface Generator {
	public abstract void generate(String IdReq, ParsedProgram p) throws FileNotFoundException;
}
