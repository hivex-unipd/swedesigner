package server.compiler;

import java.io.IOException;
import java.util.List;

public interface Compiler {

	/**
	 * Compiles the source file(s) in the given path
	 * into an executable file, then returns a list of
	 * compilation errors, if any. (The path can be a
	 * single file or a directory containing files.)
	 * @param  path        the path to the source file(s)
	 * @return             the list of compilation errors
	 * @throws IOException a file I/O exception
	 */
	List<String> compile(String path) throws IOException;
}
