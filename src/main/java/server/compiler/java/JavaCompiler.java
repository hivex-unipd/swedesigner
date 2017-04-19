package server.compiler.java;

import server.compiler.Compiler;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import javax.tools.ToolProvider;
import javax.tools.JavaFileObject;
import javax.tools.DiagnosticCollector;
import javax.tools.Diagnostic;
import javax.tools.StandardJavaFileManager;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class JavaCompiler implements Compiler {

	/**
	 * Compiles the Java source files in the given directory
	 * into an executable .class file containing JVM bytecode;
	 * then returns a list of compilation errors, if any.
	 * @param  dirPath     the directory path
	 * @return             the list of compilation errors
	 * @throws IOException a file I/O exception
	 */
	@Override
	public List<String> compile(String dirPath) throws IOException {
		List<String> errors = new ArrayList<String>(); 
		File folder = new File(dirPath);

		if (folder.exists() && folder.isDirectory()) {	
			File[] files = folder.listFiles(
				new FilenameFilter() {
					@Override 
					public boolean accept(File dir, String name) { 
						return name.endsWith(".java"); 
					} 
				}
			);

			for (File file : files) {
				if (file.isFile()) {
					try {
						errors.addAll(compileFile(file.getAbsolutePath()));
					} catch (IOException e) {
						errors.add("Error when compiling file " + file.getName());
					}
				}
			}
		} else {
			errors.add(folder.getName() + " is not a valid directory");
		}

		return errors;
	}

	private List<String> compileFile(String fileName) throws IOException {
		List<String> errors = new ArrayList<String>(); 
		javax.tools.JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
		DiagnosticCollector<JavaFileObject> diagnosticsCollector = new DiagnosticCollector<JavaFileObject>();
		StandardJavaFileManager fileManager = compiler.getStandardFileManager(diagnosticsCollector, null, null);
		Iterable<? extends JavaFileObject> compilationUnits = fileManager.getJavaFileObjectsFromStrings(Arrays.asList(fileName));
		javax.tools.JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, diagnosticsCollector, null, null, compilationUnits);
		boolean success = task.call();
		if (!success) {
			List<Diagnostic<? extends JavaFileObject>> diagnostics = diagnosticsCollector.getDiagnostics();
			for (Diagnostic<? extends JavaFileObject> diagnostic : diagnostics) {
				errors.add(diagnostic.getMessage(null));
			}
		}
		fileManager.close();
		return errors;
	}
}
