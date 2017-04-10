package server.compiler;

import java.io.IOException;
import java.util.List;

public interface Compiler {

	/**
	 * Compiles the given source file into an executable
	 * file, then returns a list of compilation errors, if any.
	 * @param  fileName    the path of a source file
	 * @return             the list of compilation errors
	 * @throws IOException a file I/O exception
	 */
	List<String> compile(String path) throws IOException;
}
